package main

import (
	"fmt"
	"log"
	"os"
	"time"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
	"github.com/joho/godotenv"
)

var db *gorm.DB
var err error
var secretKey []byte

type Claims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

type User struct {
	gorm.Model
	Name        string `json:"name"`
	Email       string `json:"email" gorm:"unique"`
	TableNumber int    `json:"table_number"`
}

type Menu struct {
	gorm.Model
	Name      string  `json:"name"`
	ImageURL  string  `json:"image_url"`
	Type      string  `json:"type"`
	Price     float64 `json:"price"`
	Available bool    `json:"available"`
}

type Order struct {
	gorm.Model
	UserID       uint    `json:"user_id"`
	Status       string  `json:"status"`
	PaymentStatus string `json:"payment_status"`
	TotalPrice   float64 `json:"total_price"`
}

type OrderItem struct {
	gorm.Model
	OrderID uint    `json:"order_id"`
	MenuID  uint    `json:"menu_id"`
	Quantity int   `json:"quantity"`
	Price   float64 `json:"price"`
}

type Admin struct {
	gorm.Model
	Username string `json:"username" gorm:"unique"`
	Password string `json:"password"`
}

func init() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found")
	}

	// Set default values if environment variables are not set
	dbHost := getEnv("DB_HOST", "localhost")
	dbPort := getEnv("DB_PORT", "5432")
	dbUser := getEnv("DB_USER", "postgres")
	dbName := getEnv("DB_NAME", "go-menu")
	dbPassword := getEnv("DB_PASSWORD", "")
	dbSSLMode := getEnv("DB_SSLMODE", "disable")
	
	// Set JWT secret key from environment variable
	secretKey = []byte(getEnv("JWT_SECRET", "your-256-bit-secret"))

	// Build database connection string
	dbURI := fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=%s",
		dbHost, dbPort, dbUser, dbName, dbPassword, dbSSLMode)

	// Connect to database
	db, err = gorm.Open("postgres", dbURI)
	if err != nil {
		log.Fatal("failed to connect to database: ", err)
		os.Exit(1)
	}

	// Auto migrate models
	db.AutoMigrate(&User{}, &Menu{}, &Order{}, &OrderItem{}, &Admin{})

	// Check if admin exists, if not create default admin
	var adminCount int
	db.Model(&Admin{}).Count(&adminCount)
	if adminCount == 0 {
		// Create default admin
		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
		admin := Admin{
			Username: "admin",
			Password: string(hashedPassword),
		}
		db.Create(&admin)
	}
}

// Helper function to get environment variable with default value
func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

func main() {
	r := gin.Default()

	// Admin routes
	admin := r.Group("/admin")
	{
		admin.POST("/login", AdminLogin)
		
		// Protected routes
		protected := admin.Group("")
		protected.Use(AuthMiddleware())
		{
			// Menu Management
			protected.GET("/menu", GetAllMenu)
			protected.GET("/menu/id/:id", GetMenuByID)
			protected.GET("/menu/name/:name", GetMenuByName)
			protected.POST("/menu", AddMenuItem)
			protected.PUT("/menu/id/:id", UpdateMenuByID)
			protected.PUT("/menu/name/:name", UpdateMenuByName)
			protected.DELETE("/menu/id/:id", DeleteMenuByID)
			protected.DELETE("/menu/name/:name", DeleteMenuByName)

			// Order Management
			protected.GET("/orders", GetAllOrders)
			protected.GET("/orders/:id", GetOrderByID)
			protected.PUT("/orders/:id/status", UpdateOrderStatus)
			protected.PUT("/orders/:id/payment", UpdatePaymentStatus)
		}
	}

	// User routes
	user := r.Group("/users")
	{
		user.POST("", CreateUser)
		user.GET("/menu", GetMenu)
		user.POST("/orders", CreateUserOrder)
		user.GET("/orders/:user_id", GetUserOrders)
	}

	r.Run(":8000")
}

// JWT Authentication Middleware
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(401, gin.H{"error": "Authorization header is required"})
			c.Abort()
			return
		}

		bearerToken := strings.Split(authHeader, " ")
		if len(bearerToken) != 2 {
			c.JSON(401, gin.H{"error": "Invalid token format"})
			c.Abort()
			return
		}

		tokenString := bearerToken[1]
		claims := &Claims{}

		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return secretKey, nil
		})

		if err != nil {
			c.JSON(401, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		if !token.Valid {
			c.JSON(401, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		c.Set("username", claims.Username)
		c.Next()
	}
}

// Admin Login with JWT
func AdminLogin(c *gin.Context) {
	var loginData struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&loginData); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	var admin Admin
	if err := db.Where("username = ?", loginData.Username).First(&admin).Error; err != nil {
		c.JSON(401, gin.H{"error": "Invalid username or password"})
		return
	}

	// Compare password
	if err := bcrypt.CompareHashAndPassword([]byte(admin.Password), []byte(loginData.Password)); err != nil {
		c.JSON(401, gin.H{"error": "Invalid username or password"})
		return
	}

	// Create JWT token
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Username: admin.Username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		c.JSON(500, gin.H{"error": "Could not generate token"})
		return
	}

	c.JSON(200, gin.H{
		"message": "Login successful",
		"token": tokenString,
	})
}

// Create User
func CreateUser(c *gin.Context) {
	var user User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	db.Create(&user)
	c.JSON(201, user)
}

// Get all menu items
func GetMenu(c *gin.Context) {
	var menuItems []Menu
	db.Find(&menuItems)
	c.JSON(200, menuItems)
}

// Add a new menu item (Admin only)
func AddMenuItem(c *gin.Context) {
	var menu Menu
	if err := c.ShouldBindJSON(&menu); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	db.Create(&menu)
	c.JSON(201, menu)
}

// Admin: Get all menu items
func GetAllMenu(c *gin.Context) {
	var menuItems []Menu
	db.Find(&menuItems)
	c.JSON(200, menuItems)
}

// Admin: Get menu by ID
func GetMenuByID(c *gin.Context) {
	id := c.Param("id")
	var menu Menu
	if err := db.First(&menu, id).Error; err != nil {
		c.JSON(404, gin.H{"error": "Menu not found"})
		return
	}
	c.JSON(200, menu)
}

// Admin: Get menu by name
func GetMenuByName(c *gin.Context) {
	name := c.Param("name")
	var menu Menu
	if err := db.Where("name LIKE ?", "%"+name+"%").First(&menu).Error; err != nil {
		c.JSON(404, gin.H{"error": "Menu not found"})
		return
	}
	c.JSON(200, menu)
}

// Admin: Delete menu by ID
func DeleteMenuByID(c *gin.Context) {
	id := c.Param("id")
	var menu Menu
	if err := db.First(&menu, id).Error; err != nil {
		c.JSON(404, gin.H{"error": "Menu not found"})
		return
	}
	db.Delete(&menu)
	c.JSON(200, gin.H{"message": "Menu deleted successfully"})
}

// Admin: Delete menu by name
func DeleteMenuByName(c *gin.Context) {
	name := c.Param("name")
	var menu Menu
	if err := db.Where("name = ?", name).First(&menu).Error; err != nil {
		c.JSON(404, gin.H{"error": "Menu not found"})
		return
	}
	db.Delete(&menu)
	c.JSON(200, gin.H{"message": "Menu deleted successfully"})
}

// Admin: Update menu by ID
func UpdateMenuByID(c *gin.Context) {
	id := c.Param("id")
	var menu Menu
	if err := db.First(&menu, id).Error; err != nil {
		c.JSON(404, gin.H{"error": "Menu not found"})
		return
	}

	var updatedMenu Menu
	if err := c.ShouldBindJSON(&updatedMenu); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	menu.Name = updatedMenu.Name
	menu.ImageURL = updatedMenu.ImageURL
	menu.Type = updatedMenu.Type
	menu.Price = updatedMenu.Price
	menu.Available = updatedMenu.Available

	db.Save(&menu)
	c.JSON(200, menu)
}

// Admin: Update menu by name
func UpdateMenuByName(c *gin.Context) {
	name := c.Param("name")
	var menu Menu
	if err := db.Where("name = ?", name).First(&menu).Error; err != nil {
		c.JSON(404, gin.H{"error": "Menu not found"})
		return
	}

	var updatedMenu Menu
	if err := c.ShouldBindJSON(&updatedMenu); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	menu.Name = updatedMenu.Name
	menu.ImageURL = updatedMenu.ImageURL
	menu.Type = updatedMenu.Type
	menu.Price = updatedMenu.Price
	menu.Available = updatedMenu.Available

	db.Save(&menu)
	c.JSON(200, menu)
}

// Create User Order with Items
func CreateUserOrder(c *gin.Context) {
	// Structure for order request
	var orderRequest struct {
		UserID    uint         `json:"user_id"`
		MenuItems []OrderItem `json:"menu_items"`
	}

	if err := c.ShouldBindJSON(&orderRequest); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Verify user exists
	var user User
	if err := db.First(&user, orderRequest.UserID).Error; err != nil {
		c.JSON(404, gin.H{"error": "User not found"})
		return
	}

	// Calculate total price and verify menu items
	var totalPrice float64
	for i, item := range orderRequest.MenuItems {
		var menu Menu
		if err := db.First(&menu, item.MenuID).Error; err != nil {
			c.JSON(404, gin.H{"error": fmt.Sprintf("Menu item with ID %d not found", item.MenuID)})
			return
		}
		if !menu.Available {
			c.JSON(400, gin.H{"error": fmt.Sprintf("Menu item %s is not available", menu.Name)})
			return
		}
		// Set the price from menu
		orderRequest.MenuItems[i].Price = menu.Price * float64(item.Quantity)
		totalPrice += orderRequest.MenuItems[i].Price
	}

	// Create order
	order := Order{
		UserID:        orderRequest.UserID,
		Status:        "pending",
		PaymentStatus: "unpaid",
		TotalPrice:    totalPrice,
	}
	
	if err := db.Create(&order).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to create order"})
		return
	}

	// Create order items
	for _, item := range orderRequest.MenuItems {
		item.OrderID = order.ID
		if err := db.Create(&item).Error; err != nil {
			c.JSON(500, gin.H{"error": "Failed to create order items"})
			return
		}
	}

	// Get complete order with items
	var completeOrder struct {
		Order      Order       `json:"order"`
		OrderItems []OrderItem `json:"order_items"`
	}
	
	db.First(&completeOrder.Order, order.ID)
	db.Where("order_id = ?", order.ID).Find(&completeOrder.OrderItems)

	c.JSON(201, completeOrder)
}

// Get User Orders
func GetUserOrders(c *gin.Context) {
	userID := c.Param("user_id")
	var orders []Order
	if err := db.Where("user_id = ?", userID).Find(&orders).Error; err != nil {
		c.JSON(404, gin.H{"error": "No orders found"})
		return
	}

	var response []struct {
		Order      Order       `json:"order"`
		OrderItems []OrderItem `json:"order_items"`
	}

	for _, order := range orders {
		var orderItems []OrderItem
		db.Where("order_id = ?", order.ID).Find(&orderItems)
		
		response = append(response, struct {
			Order      Order       `json:"order"`
			OrderItems []OrderItem `json:"order_items"`
		}{
			Order:      order,
			OrderItems: orderItems,
		})
	}

	c.JSON(200, response)
}

// Get All Orders (Admin)
func GetAllOrders(c *gin.Context) {
	var orders []struct {
		Order      Order       `json:"order"`
		User       User        `json:"user"`
		OrderItems []OrderItem `json:"order_items"`
	}

	// Get all orders
	var baseOrders []Order
	db.Find(&baseOrders)

	for _, order := range baseOrders {
		var user User
		var orderItems []OrderItem
		
		db.First(&user, order.UserID)
		db.Where("order_id = ?", order.ID).Find(&orderItems)

		// Get menu details for each order item
		for i := range orderItems {
			var menu Menu
			db.First(&menu, orderItems[i].MenuID)
			orderItems[i].Price = menu.Price * float64(orderItems[i].Quantity)
		}

		orders = append(orders, struct {
			Order      Order       `json:"order"`
			User       User        `json:"user"`
			OrderItems []OrderItem `json:"order_items"`
		}{
			Order:      order,
			User:       user,
			OrderItems: orderItems,
		})
	}

	c.JSON(200, orders)
}

// Get Order by ID (Admin)
func GetOrderByID(c *gin.Context) {
	id := c.Param("id")
	
	var response struct {
		Order      Order       `json:"order"`
		User       User        `json:"user"`
		OrderItems []OrderItem `json:"order_items"`
	}

	// Get order
	if err := db.First(&response.Order, id).Error; err != nil {
		c.JSON(404, gin.H{"error": "Order not found"})
		return
	}

	// Get user
	db.First(&response.User, response.Order.UserID)

	// Get order items with menu details
	db.Where("order_id = ?", id).Find(&response.OrderItems)
	for i := range response.OrderItems {
		var menu Menu
		db.First(&menu, response.OrderItems[i].MenuID)
		response.OrderItems[i].Price = menu.Price * float64(response.OrderItems[i].Quantity)
	}

	c.JSON(200, response)
}

// Update Order Status (Admin)
func UpdateOrderStatus(c *gin.Context) {
	id := c.Param("id")
	
	var order Order
	if err := db.First(&order, id).Error; err != nil {
		c.JSON(404, gin.H{"error": "Order not found"})
		return
	}

	var input struct {
		Status string `json:"status" binding:"required,oneof=pending processing completed cancelled"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": "Invalid status. Must be one of: pending, processing, completed, cancelled"})
		return
	}

	order.Status = input.Status
	db.Save(&order)

	// Get complete order details
	var response struct {
		Order      Order       `json:"order"`
		User       User        `json:"user"`
		OrderItems []OrderItem `json:"order_items"`
	}
	
	response.Order = order
	db.First(&response.User, order.UserID)
	db.Where("order_id = ?", id).Find(&response.OrderItems)

	c.JSON(200, response)
}

// Update Payment Status (Admin)
func UpdatePaymentStatus(c *gin.Context) {
	id := c.Param("id")
	
	var order Order
	if err := db.First(&order, id).Error; err != nil {
		c.JSON(404, gin.H{"error": "Order not found"})
		return
	}

	var input struct {
		PaymentStatus string `json:"payment_status" binding:"required,oneof=unpaid paid refunded"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": "Invalid payment status. Must be one of: unpaid, paid, refunded"})
		return
	}

	order.PaymentStatus = input.PaymentStatus
	db.Save(&order)

	// Get complete order details
	var response struct {
		Order      Order       `json:"order"`
		User       User        `json:"user"`
		OrderItems []OrderItem `json:"order_items"`
	}
	
	response.Order = order
	db.First(&response.User, order.UserID)
	db.Where("order_id = ?", id).Find(&response.OrderItems)

	c.JSON(200, response)
}