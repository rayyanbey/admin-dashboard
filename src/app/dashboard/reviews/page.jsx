"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axios from "axios"
import { Loader2 } from "lucide-react"

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [newReview, setNewReview] = useState({
    name: "",
    profession: "",
    review: "",
    image: null,
    rating: 1,
  })
  const [editingReviewId, setEditingReviewId] = useState(null)
  const [editingReview, setEditingReview] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [actionInProgress, setActionInProgress] = useState(null)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST_NAME}/reviews/getReviews`)
      setReviews(Array.isArray(response.data.data) ? response.data.data : [])
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddReview = async () => {
    setActionInProgress("add")
    const formData = new FormData()
    formData.append("name", newReview.name)
    formData.append("profession", newReview.profession)
    formData.append("review", newReview.review)
    formData.append("rating", newReview.rating.toString())
    formData.append("image", newReview.image)

    try {
      await axios.post(`http://localhost:3000/pages/apis/reviews/createReview`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      await fetchReviews()
      setNewReview({
        name: "",
        profession: "",
        review: "",
        image: null,
        rating: 1,
      })
    } catch (error) {
      console.error("Error adding review:", error)
    } finally {
      setActionInProgress(null)
    }
  }

  const handleDeleteReview = async (id) => {
    setActionInProgress(`delete-${id}`)
    try {
      await axios.delete(`http://localhost:3000/pages/apis/reviews/deleteReview`, {
        headers: {
          "Content-Type": "application/json",
        },
        data: { id },
      })
      await fetchReviews()
    } catch (error) {
      console.error("Error deleting review:", error)
    } finally {
      setActionInProgress(null)
    }
  }

  const handleUpdateReview = async () => {
    setActionInProgress(`update-${editingReviewId}`)
    try {
      const payload = {
        id: editingReviewId,
        name: editingReview.name,
        profession: editingReview.profession,
        review: editingReview.review,
        rating: editingReview.rating,
        image: editingReview.image instanceof File ? null : editingReview.image,
      }

      if (editingReview.image instanceof File) {
        alert("Image Cannot be updated, Enter a new Review if image is to be changed")
      }

      //https://dar-el-mecca.vercel.app/pages/apis/reviews/updateReview
      console.log(process.env.NEXT_PUBLIC_HOST_NAME)
      await axios.put(`http://localhost:3000/pages/apis/reviews/updateReview`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      await fetchReviews()
      setEditingReviewId(null)
    } catch (error) {
      console.error("Error updating review:", error)
    } finally {
      setActionInProgress(null)
    }
  }

  const handleImageUpload = (e) => {
    setNewReview({ ...newReview, image: e.target.files[0] })
  }

  const filteredReviews = reviews.filter(
    (review) =>
      review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.profession.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const startEditing = (review) => {
    setEditingReviewId(review.id)
    setEditingReview({ ...review })
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Review Management</h1>

      <Input
        placeholder="Search reviews..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />

      <div className="space-y-2">
        <Input
          placeholder="Name"
          value={newReview.name}
          onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
          className="max-w-sm"
        />
        <Input
          placeholder="Profession"
          value={newReview.profession}
          onChange={(e) => setNewReview({ ...newReview, profession: e.target.value })}
          className="max-w-sm"
        />
        <Input
          placeholder="Review"
          value={newReview.review}
          onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
          className="max-w-sm"
        />
        <Input
          placeholder="Rating"
          type="number"
          value={newReview.rating}
          onChange={(e) => {
            const rating = Math.min(5, Math.max(1, e.target.value))
            setNewReview({ ...newReview, rating })
          }}
          className="max-w-sm"
        />
        <input type="file" accept="image/*" onChange={handleImageUpload} className="block max-w-sm" />
        <Button onClick={handleAddReview} disabled={actionInProgress === "add"}>
          {actionInProgress === "add" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            "Add Review"
          )}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Profession</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>{review.id}</TableCell>
                <TableCell>
                  {editingReviewId === review.id ? (
                    <Input
                      value={editingReview.name}
                      onChange={(e) => setEditingReview({ ...editingReview, name: e.target.value })}
                    />
                  ) : (
                    review.name
                  )}
                </TableCell>
                <TableCell>
                  {editingReviewId === review.id ? (
                    <Input
                      value={editingReview.profession}
                      onChange={(e) => setEditingReview({ ...editingReview, profession: e.target.value })}
                    />
                  ) : (
                    review.profession
                  )}
                </TableCell>
                <TableCell>
                  {editingReviewId === review.id ? (
                    <Input
                      value={editingReview.review}
                      onChange={(e) => setEditingReview({ ...editingReview, review: e.target.value })}
                    />
                  ) : (
                    review.review
                  )}
                </TableCell>
                <TableCell>
                  {editingReviewId === review.id ? (
                    <Input
                      type="number"
                      value={editingReview.rating}
                      onChange={(e) =>
                        setEditingReview({
                          ...editingReview,
                          rating: Math.min(5, Math.max(1, e.target.value)),
                        })
                      }
                    />
                  ) : (
                    review.rating
                  )}
                </TableCell>
                <TableCell>
                  {editingReviewId === review.id ? (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setEditingReview({ ...editingReview, image: e.target.files[0] })}
                    />
                  ) : (
                    <img
                      src={review.image || "/placeholder.svg"}
                      alt={review.name}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                </TableCell>
                <TableCell>
                  {editingReviewId === review.id ? (
                    <div className="flex gap-2">
                      <Button onClick={handleUpdateReview} disabled={actionInProgress === `update-${review.id}`}>
                        {actionInProgress === `update-${review.id}` ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingReviewId(null)}
                        disabled={actionInProgress === `update-${review.id}`}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteReview(review.id)}
                        disabled={actionInProgress === `delete-${review.id}`}
                      >
                        {actionInProgress === `delete-${review.id}` ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => startEditing(review)}
                        disabled={actionInProgress !== null}
                      >
                        Edit
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

