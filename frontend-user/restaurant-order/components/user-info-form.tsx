"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { UserRound, Mail, Coffee, ArrowRight } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  tableNumber: z.string().min(1, { message: "Table number is required." }),
})

type UserInfoFormProps = {
  onSubmit: (data: z.infer<typeof formSchema>) => void
  onCancel: () => void
}

export default function UserInfoForm({ onSubmit, onCancel }: UserInfoFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      tableNumber: "",
    },
  })

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values)
  }

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } },
  }

  return (
    <Card className="w-full overflow-hidden border-none shadow-lg bg-white rounded-3xl">
      <CardHeader className="space-y-1 bg-gradient-to-r from-orange-400 to-red-500 text-white p-6">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <CardTitle className="text-2xl font-bold text-center">Welcome</CardTitle>
          <CardDescription className="text-center text-white/80">
            Please enter your information to continue
          </CardDescription>
        </motion.div>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Name</FormLabel>
                  <FormControl>
                    <motion.div whileFocus="focus" whileTap="focus" variants={inputVariants} className="relative">
                      <UserRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 h-5 w-5" />
                      <Input
                        placeholder="Enter your name"
                        {...field}
                        className="pl-10 py-6 rounded-xl border-orange-100 focus:border-orange-300 focus:ring focus:ring-orange-200 transition-all"
                      />
                    </motion.div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                  <FormControl>
                    <motion.div whileFocus="focus" whileTap="focus" variants={inputVariants} className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 h-5 w-5" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                        className="pl-10 py-6 rounded-xl border-orange-100 focus:border-orange-300 focus:ring focus:ring-orange-200 transition-all"
                      />
                    </motion.div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tableNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Table Number</FormLabel>
                  <FormControl>
                    <motion.div whileFocus="focus" whileTap="focus" variants={inputVariants} className="relative">
                      <Coffee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 h-5 w-5" />
                      <Input
                        placeholder="Enter your table number"
                        {...field}
                        className="pl-10 py-6 rounded-xl border-orange-100 focus:border-orange-300 focus:ring focus:ring-orange-200 transition-all"
                      />
                    </motion.div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="pt-2">
              <Button
                type="submit"
                className="w-full py-6 rounded-xl bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white font-medium text-lg shadow-md"
              >
                Continue to Menu <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button
          variant="ghost"
          onClick={onCancel}
          className="w-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl"
        >
          Cancel
        </Button>
      </CardFooter>
    </Card>
  )
}
