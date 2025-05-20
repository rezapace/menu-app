package main

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"golang.org/x/crypto/bcrypt"
)

func seedData(db *gorm.DB) {
	// Create Admin
	adminPassword, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	admin := Admin{
		Username: "admin",
		Password: string(adminPassword),
	}
	db.Create(&admin)

	// Create Menu Items
	menuItems := []Menu{
		{
			Name:      "Nasi Goreng Special",
			ImageURL:  "https://example.com/nasi-goreng.jpg",
			Type:      "Main Course",
			Price:     35000,
			Available: true,
		},
		{
			Name:      "Mie Goreng",
			ImageURL:  "https://example.com/mie-goreng.jpg",
			Type:      "Main Course",
			Price:     30000,
			Available: true,
		},
		{
			Name:      "Es Teh Manis",
			ImageURL:  "https://example.com/es-teh.jpg",
			Type:      "Beverage",
			Price:     8000,
			Available: true,
		},
		{
			Name:      "Juice Alpukat",
			ImageURL:  "https://example.com/juice-alpukat.jpg",
			Type:      "Beverage",
			Price:     15000,
			Available: true,
		},
		{
			Name:      "Sate Ayam",
			ImageURL:  "https://example.com/sate-ayam.jpg",
			Type:      "Main Course",
			Price:     25000,
			Available: true,
		},
		{
			Name:      "Gado-gado",
			ImageURL:  "https://example.com/gado-gado.jpg",
			Type:      "Main Course",
			Price:     20000,
			Available: true,
		},
		{
			Name:      "Soto Ayam",
			ImageURL:  "https://example.com/soto-ayam.jpg",
			Type:      "Main Course",
			Price:     28000,
			Available: true,
		},
		{
			Name:      "Es Jeruk",
			ImageURL:  "https://example.com/es-jeruk.jpg",
			Type:      "Beverage",
			Price:     10000,
			Available: true,
		},
	}
	for _, item := range menuItems {
		db.Create(&item)
	}

	// Create Users
	users := []User{
		{
			Name:        "John Doe",
			Email:       "john@example.com",
			TableNumber: 1,
		},
		{
			Name:        "Jane Smith",
			Email:       "jane@example.com",
			TableNumber: 2,
		},
		{
			Name:        "Ahmad Rizki",
			Email:       "ahmad@example.com",
			TableNumber: 3,
		},
		{
			Name:        "Sarah Wilson",
			Email:       "sarah@example.com",
			TableNumber: 4,
		},
	}
	for _, user := range users {
		db.Create(&user)
	}

	// Create Orders
	orders := []Order{
		{
			UserID:        users[0].ID,
			Status:        "completed",
			PaymentStatus: "paid",
			TotalPrice:    43000,
		},
		{
			UserID:        users[1].ID,
			Status:        "pending",
			PaymentStatus: "unpaid",
			TotalPrice:    65000,
		},
		{
			UserID:        users[2].ID,
			Status:        "processing",
			PaymentStatus: "paid",
			TotalPrice:    38000,
		},
	}
	for _, order := range orders {
		db.Create(&order)
	}

	// Create Order Items
	orderItems := []OrderItem{
		{
			OrderID:  orders[0].ID,
			MenuID:   menuItems[0].ID, // Nasi Goreng
			Quantity: 1,
			Price:    35000,
		},
		{
			OrderID:  orders[0].ID,
			MenuID:   menuItems[2].ID, // Es Teh Manis
			Quantity: 1,
			Price:    8000,
		},
		{
			OrderID:  orders[1].ID,
			MenuID:   menuItems[4].ID, // Sate Ayam
			Quantity: 2,
			Price:    50000,
		},
		{
			OrderID:  orders[1].ID,
			MenuID:   menuItems[7].ID, // Es Jeruk
			Quantity: 1,
			Price:    15000,
		},
		{
			OrderID:  orders[2].ID,
			MenuID:   menuItems[1].ID, // Mie Goreng
			Quantity: 1,
			Price:    30000,
		},
		{
			OrderID:  orders[2].ID,
			MenuID:   menuItems[2].ID, // Es Teh Manis
			Quantity: 1,
			Price:    8000,
		},
	}
	for _, item := range orderItems {
		db.Create(&item)
	}
} 