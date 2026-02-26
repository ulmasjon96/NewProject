import Resume from '@/components/resume/Resume';
import { Link } from 'react-router-dom';

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-background  pb-16 relative">
      {/* back button */}
      <Link
        to="/"
        className="fixed left-6 top-6 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-xl shadow-lg hover:scale-105 transition"
      >
        ← Back
      </Link>

      <Resume />
    </div>
  );
}
