import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { type User } from '../types';
import toast from 'react-hot-toast';
import { isAxiosError } from 'axios';
import { z } from 'zod';

interface RegisterFormProps {
  onSuccess?: (user: User) => void;
}

// Zod schema
const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters long'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters long'),
  email: z.string().email('Invalid email address'),
});

type FormFields = 'firstName' | 'lastName' | 'email';

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [errors, setErrors] = useState<Partial<Record<FormFields, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    // Validate on submit
    const validation = registerSchema.safeParse(form);
    if (!validation.success) {
      const fieldErrors: Partial<Record<FormFields, string>> = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as FormFields;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      // Generate DiceBear avatar
      const seed = `${form.firstName}-${form.lastName}-${Math.random()
        .toString(36)
        .substring(2, 7)}`;
      const profileImage = `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}`;

      const res = await api.post('/users', {
        ...form,
        profileImage,
      });

      const user: User = res.data;
      toast.success('🎉 User created successfully!');
      if (onSuccess) onSuccess(user);
      setTimeout(() => navigate('/users'), 2000);
    } catch (err: unknown) {
      console.error(err);
      if (
        isAxiosError(err) &&
        err.response?.data?.error?.includes('Email already exists')
      ) {
        setErrors({ email: 'Email already exists. Please use another.' });
        toast.error('⚠️ Email already exists. Please use another.');
      } else {
        toast.error('❌ Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-4 bg-gray-800 p-6 rounded-xl max-w-md mx-auto"
    >
      {(['firstName', 'lastName', 'email'] as const).map((field) => (
        <div key={field}>
          <label
            htmlFor={field}
            className="block text-gray-300 mb-1 capitalize"
          >
            {field === 'email' ? 'Email Address' : field}
          </label>
          <input
            id={field}
            type={field === 'email' ? 'email' : 'text'}
            value={form[field]}
            onChange={handleChange}
            className={`w-full p-2 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-400 ${
              submitted && errors[field] ? 'border-red-500' : ''
            }`}
            required
            aria-invalid={!!errors[field]}
            aria-describedby={`${field}-error`}
          />
          {submitted && errors[field] && (
            <p
              id={`${field}-error`}
              className="text-red-400 text-sm mt-1 bg-red-900/20 p-1 rounded-md"
              role="alert"
            >
              {errors[field]}
            </p>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className={`bg-sky-500 text-white rounded-xl px-4 py-2 font-medium hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-colors ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? '⏳ Creating...' : '🧿 Sign Up'}
      </button>
    </form>
  );
}
