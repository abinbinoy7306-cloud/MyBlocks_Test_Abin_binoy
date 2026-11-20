import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 text-center">
      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold text-2xl mx-auto mb-4">
        404
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Page Not Found</h1>
      <p className="text-gray-500 text-sm max-w-sm mb-6">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
    </div>
  );
}
