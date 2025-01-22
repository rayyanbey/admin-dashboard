'use client';

import { useEffect, useState } from 'react';
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
import axios from 'axios';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newReview, setNewReview] = useState({
    name: '',
    profession: '',
    review: '',
    image: null,
    rating: 1,
  });
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingReview, setEditingReview] = useState({});

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://localhost:3000/pages/apis/reviews/getReviews');
      setReviews(response.data.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleAddReview = async () => {
    const formData = new FormData();
    formData.append('name', newReview.name);
    formData.append('profession', newReview.profession);
    formData.append('review', newReview.review);
    formData.append('image', newReview.image);

    try {
      await axios.post('http://localhost:3000/pages/apis/reviews/createReview', formData);
      fetchReviews();
      setNewReview({ name: '', profession: '', review: '', image: null, rating: 1 });
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      await axios.post('http://localhost:3000/pages/apis/reviews/deleteReview', { id });
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleUpdateReview = async (id) => {
    try {
      await axios.post('http://localhost:3000/pages/apis/reviews/updateReview', editingReview);
      fetchReviews();
      setEditingReviewId(null);
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handleImageUpload = (e) => {
    setNewReview({ ...newReview, image: e.target.files[0] });
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.profession.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            const rating = Math.min(5, Math.max(1, e.target.value));
            setNewReview({ ...newReview, rating });
          }}
          className="max-w-sm"
        />
        <input type="file" accept="image/*" onChange={handleImageUpload} className="block max-w-sm" />
        <Button onClick={handleAddReview}>Add Review</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Profession</TableHead>
            <TableHead>Review</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredReviews.map((review) => (
            <TableRow key={review.id}>
              <TableCell>{review.id}</TableCell>
              <TableCell>{review.name}</TableCell>
              <TableCell>{review.profession}</TableCell>
              <TableCell>{review.review}</TableCell>
              <TableCell>
                <img src={review.image} alt={review.name} className="w-12 h-12 rounded-full" />
              </TableCell>
              <TableCell>
                <Button onClick={() => handleDeleteReview(review.id)} variant="destructive">
                  Delete
                </Button>
                <Button onClick={() => handleUpdateReview(review.id)} variant="primary">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
