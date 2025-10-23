import { useState, useRef } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { type User } from '../types';
import toast from 'react-hot-toast';

interface RegisterFormProps {
  onSuccess?: (user: User) => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const photoRef = useRef<File | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Generate DiceBear avatar if no photo provided
      let profileImage: string | undefined;
      if (!photoRef.current) {
        const seed = `${firstName}-${lastName}-${Math.random()
          .toString(36)
          .substring(2, 7)}`;
        profileImage = `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}`;
      }

      const res = await api.post('/users', {
        firstName,
        lastName,
        email,
        ...(profileImage ? { profileImage } : {}),
      });

      const user: User = res.data;

      // Optional: upload photo if selected
      if (photoRef.current) {
        const form = new FormData();
        form.append('photo', photoRef.current);
        await api.post(`/profile/${user.id}/photo`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      toast.success('🎉 User created successfully!');
      setTimeout(() => navigate('/users'), 1500);

      if (onSuccess) onSuccess(user);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.error?.includes('Email already exists')) {
        toast.error('⚠️ Email already exists. Please use another.');
      } else {
        toast.error('❌ Could not register user. Try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <input
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="input"
        required
      />
      <input
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="input"
        required
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input"
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => (photoRef.current = e.target.files?.[0] ?? null)}
      />
      <button
        type="submit"
        className="bg-pinkyDark text-white rounded-xl px-4 py-2 hover:bg-pink-600"
      >
        Add User
      </button>
    </form>
  );
}
