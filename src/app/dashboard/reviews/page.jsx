'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Initial mock data
const initialReviews = [
  {
    id: 1,
    name: 'John Doe',
    profession: 'Software Engineer',
    description: 'Excellent product!',
    image: 'https://via.placeholder.com/50',
    rating: 5,
  },
  {
    id: 2,
    name: 'Jane Smith',
    profession: 'Designer',
    description: 'Good value for money.',
    image: 'https://via.placeholder.com/50',
    rating: 4,
  },
  {
    id: 3,
    name: 'Bob Johnson',
    profession: 'Project Manager',
    description: 'Could use some improvements.',
    image: 'https://via.placeholder.com/50',
    rating: 3,
  },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(initialReviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [newReview, setNewReview] = useState({
    name: '',
    profession: '',
    description: '',
    image: '',
    rating: 1,
  });
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingReview, setEditingReview] = useState({});

  // Filter reviews based on search term
  const filteredReviews = reviews.filter(
    (review) =>
      review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle adding a new review
  const handleAddReview = () => {
    if (
      newReview.name &&
      newReview.profession &&
      newReview.description &&
      newReview.image &&
      newReview.rating
    ) {
      setReviews([
        ...reviews,
        { id: Date.now(), ...newReview },
      ]);
      setNewReview({ name: '', profession: '', description: '', image: '', rating: 1 });
    }
  };

  // Handle deleting a review
  const handleDeleteReview = (id) => {
    setReviews(reviews.filter((review) => review.id !== id));
  };

  // Handle updating a review
  const handleUpdateReview = (id) => {
    setReviews(
      reviews.map((review) =>
        review.id === id ? { ...review, ...editingReview } : review
      )
    );
    setEditingReviewId(null); // Exit edit mode
    setEditingReview({});
  };

  // Handle file upload and convert it to a data URL
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewReview({ ...newReview, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Review Management</h1>

      {/* Search Input */}
      <Input
        placeholder="Search reviews..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />

      {/* Add Review Form */}
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
          placeholder="Description"
          value={newReview.description}
          onChange={(e) => setNewReview({ ...newReview, description: e.target.value })}
          className="max-w-sm"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block max-w-sm"
        />
        <Input
          type="number"
          min="1"
          max="5"
          placeholder="Rating (1-5)"
          value={newReview.rating}
          onChange={(e) =>
            setNewReview({ ...newReview, rating: Math.min(Math.max(Number(e.target.value), 1), 5) })
          }
          className="max-w-sm"
        />
        <Button onClick={handleAddReview}>Add Review</Button>
      </div>

      {/* Reviews Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Profession</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredReviews.map((review) => (
            <TableRow key={review.id}>
              <TableCell>{editingReviewId === review.id ? (
                <Input
                  value={editingReview.name}
                  onChange={(e) =>
                    setEditingReview({ ...editingReview, name: e.target.value })
                  }
                  className="max-w-sm"
                />
              ) : (
                review.name
              )}</TableCell>
              <TableCell>{editingReviewId === review.id ? (
                <Input
                  value={editingReview.profession}
                  onChange={(e) =>
                    setEditingReview({ ...editingReview, profession: e.target.value })
                  }
                  className="max-w-sm"
                />
              ) : (
                review.profession
              )}</TableCell>
              <TableCell>{editingReviewId === review.id ? (
                <Input
                  value={editingReview.description}
                  onChange={(e) =>
                    setEditingReview({ ...editingReview, description: e.target.value })
                  }
                  className="max-w-sm"
                />
              ) : (
                review.description
              )}</TableCell>
              <TableCell>
                <img src={review.image} alt="Review" className="w-12 h-12 rounded-full" />
              </TableCell>
              <TableCell>{editingReviewId === review.id ? (
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={editingReview.rating}
                  onChange={(e) =>
                    setEditingReview({
                      ...editingReview,
                      rating: Math.min(Math.max(Number(e.target.value), 1), 5),
                    })
                  }
                  className="max-w-sm"
                />
              ) : (
                review.rating
              )}</TableCell>
              <TableCell>
                {editingReviewId === review.id ? (
                  <Button onClick={() => handleUpdateReview(review.id)}>Save</Button>
                ) : (
                  <Button
                    onClick={() => {
                      setEditingReviewId(review.id);
                      setEditingReview({ ...review });
                    }}
                  >
                    Edit
                  </Button>
                )}
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteReview(review.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
