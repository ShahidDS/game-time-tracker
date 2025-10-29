import RegisterForm from '../components/RegitsterForm';

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-96px)] px-4 md:px-0">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-pinkyDark">
          Register
        </h1>
        <RegisterForm />
      </div>
    </div>
  );
}
