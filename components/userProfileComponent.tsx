/** @format */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, Mail, Pencil, User, Check, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Business } from '@/backend/types/type'

interface UserProfile {
	_id: string
	username: string
	contact: string
	created_at: string
	last_login: string | null
	isVerified: boolean
	createdAt: string
	updatedAt: string
}

export default function UserProfileComponent({
	user: initialUser,
	businesses,
	setIsProfileOpen,
	onClose,
    
}: {
	user: UserProfile
	businesses: Business[]
	setIsProfileOpen: React.Dispatch<React.SetStateAction<boolean>>
	onClose: () => void
}) {
	const [user, setUser] = useState(initialUser)
	const [isEditing, setIsEditing] = useState(false)
	const [editedUser, setEditedUser] = useState(initialUser)

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString()
	}

	const handleProfileEdit = (field: 'username' | 'contact', value: string) => {
		setEditedUser((prevUser) => ({ ...prevUser, [field]: value }))
	}
	

	const saveChanges = () => {
		setUser(editedUser)
		setIsEditing(false)
	}
	const openBusinessDetail = () => {
		setIsProfileOpen(true)

	}

	return (
		<Card className="w-full max-w-md mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
			<CardHeader className="relative p-0">
				<div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700"></div>
				<div className="relative flex flex-col items-center justify-center py-6 sm:py-10 text-white z-10">
					<Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-white shadow-lg">
						<AvatarImage
							src="/placeholder.svg?height=96&width=96"
							alt={user.username}
						/>
						<AvatarFallback>
							{user.username.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<h2 className="mt-4 text-xl sm:text-2xl font-bold">
						{user.username}
					</h2>
					<p className="text-sm sm:text-base text-blue-100">{user.contact}</p>
				</div>
			</CardHeader>
			<CardContent className="p-4 sm:p-6">
				<Tabs defaultValue="details" className="w-full">
					<TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6">
						<TabsTrigger
							value="details"
							className="text-sm sm:text-base data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200">
							Account Details
						</TabsTrigger>
						<TabsTrigger
							value="businesses"
							className="text-sm sm:text-base data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200">
							My Businesses
						</TabsTrigger>
					</TabsList>
					<ScrollArea className="h-[350px] sm:h-[400px] w-full rounded-md">
						<TabsContent value="details">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
								className="space-y-4 sm:space-y-6">
								<div className="space-y-2">
									<Label
										htmlFor="username"
										className="flex items-center space-x-2 text-sm font-medium text-gray-700">
										<User className="h-4 w-4" />
										<span>Username</span>
									</Label>
									<Input
										id="username"
										value={isEditing ? editedUser.username : user.username}
										onChange={(e) =>
											handleProfileEdit('username', e.target.value)
										}
										disabled={!isEditing}
										className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
									/>
								</div>
								<div className="space-y-2">
									<Label
										htmlFor="email"
										className="flex items-center space-x-2 text-sm font-medium text-gray-700">
										<Mail className="h-4 w-4" />
										<span>Email</span>
									</Label>
									<Input
										id="email"
										value={isEditing ? editedUser.contact : user.contact}
										onChange={(e) =>
											handleProfileEdit('contact', e.target.value)
										}
										disabled={!isEditing}
										className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
									/>
								</div>
								<Separator className="my-4 sm:my-6" />
								<div className="space-y-3 sm:space-y-4">
									<div>
										<Label className="text-sm font-medium text-gray-700">
											Account Created
										</Label>
										<p className="mt-1 text-sm text-gray-600">
											{formatDate(user.createdAt)}
										</p>
									</div>
									<div>
										<Label className="text-sm font-medium text-gray-700">
											Last Login
										</Label>
										<p className="mt-1 text-sm text-gray-600">
											{user.last_login ? formatDate(user.last_login) : 'Never'}
										</p>
									</div>
									<div>
										<Label className="text-sm font-medium text-gray-700">
											Account Status
										</Label>
										<p className="mt-1 text-sm">
											{user.isVerified ? (
												<span className="text-green-600 font-medium">
													Verified
												</span>
											) : (
												<span className="text-yellow-600 font-medium">
													Unverified
												</span>
											)}
										</p>
									</div>
								</div>
							</motion.div>
						</TabsContent>
						<TabsContent value="businesses">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
								className="space-y-4 sm:space-y-6">
								<Label className="text-base sm:text-lg font-medium flex items-center space-x-2 text-gray-700">
									<Building2 className="h-5 w-5" />
									<span>Your Businesses</span>
								</Label>
								{businesses.length > 0 ? (
									<ul className="space-y-2">
										{businesses.map((business) => (
											<motion.li
												key={business._id}
												initial={{ opacity: 0, x: -20 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ duration: 0.3 }}
												>
												<Button
                                                    onClick={openBusinessDetail}
													variant="outline"
													className="w-full justify-start hover:bg-blue-50 transition-colors duration-200">
													<Building2 className="h-4 w-4 mr-2 text-blue-600" />
													<span className="truncate">
														{business.name}({business.gst_number})
													</span>
												</Button>
											</motion.li>
										))}
									</ul>
								) : (
									<p className="text-sm text-gray-600">
										You haven't added any businesses yet.
									</p>
								)}
								<Button className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200">
									Add New Business
								</Button>
							</motion.div>
						</TabsContent>
					</ScrollArea>
				</Tabs>
				<AnimatePresence>
					{isEditing ? (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 20 }}
							transition={{ duration: 0.3 }}
							className="flex flex-col sm:flex-row justify-between mt-4 sm:mt-6 space-y-2 sm:space-y-0 sm:space-x-2">
							<Button
								variant="outline"
								className="w-full sm:w-1/2 border-gray-300 hover:bg-gray-100 transition-colors duration-200"
								onClick={() => setIsEditing(false)}>
								<X className="h-4 w-4 mr-2" />
								Cancel
							</Button>
							<Button
								className="w-full sm:w-1/2 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
								onClick={saveChanges}>
								<Check className="h-4 w-4 mr-2" />
								Save Changes
							</Button>
						</motion.div>
					) : (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 20 }}
							transition={{ duration: 0.3 }}>
							<Button
								className="w-full mt-4 sm:mt-6 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
								onClick={() => setIsEditing(true)}>
								<Pencil className="h-4 w-4 mr-2" />
								Edit Profile
							</Button>
						</motion.div>
					)}
				</AnimatePresence>
				<Button
					onClick={onClose}
					className="w-full mt-4 bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-200">
					Close
				</Button>
			</CardContent>
		</Card>
	)
}
