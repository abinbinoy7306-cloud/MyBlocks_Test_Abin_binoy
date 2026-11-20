import { useState, useEffect } from 'react';
import { HelpCircle, Edit3, Check, X, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { getHelpText, updateHelpText } from '../../api/helpText.api';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

export default function SectionHelp({ sectionKey, defaultTitle }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState(null);

  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const isAdmin = user?.role === 'super_admin' || user?.role === 'firm_admin';

  const fetchHelp = async () => {
    setLoading(true);
    try {
      const res = await getHelpText(sectionKey);
      const item = res.data?.data || res.data || {};
      setData(item);
      setEditTitle(item.title || defaultTitle || 'Help & Guidance');
      setEditContent(item.content || '');
    } catch (_) {
      setData({
        title: defaultTitle || 'Help & Guidance',
        content: 'No guidance has been configured for this section yet.',
      });
    }
    setLoading(false);
  };

  const handleOpen = () => {
    setOpen(true);
    setIsEditing(false);
    fetchHelp();
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    if (!editContent.trim()) {
      toast.error('Help content cannot be empty');
      return;
    }
    setSaving(true);
    try {
      const res = await updateHelpText(sectionKey, {
        title: editTitle.trim(),
        content: editContent.trim(),
      });
      const updated = res.data?.data || { title: editTitle, content: editContent };
      setData(updated);
      setIsEditing(false);
      toast.success('Help text updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update help text');
    }
    setSaving(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        title="View section help & instructions (?)"
        className="inline-flex items-center justify-center w-5 h-5 ml-1.5 rounded-full text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-800 border border-indigo-200 transition font-bold text-xs select-none shadow-2xs"
      >
        ?
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={data?.title || defaultTitle || 'Section Help'}>
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner size="md" />
            </div>
          ) : isEditing ? (
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Help Guide Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Guide Title"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Help Content & Instructions
                </label>
                <textarea
                  rows={6}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                  placeholder="Explain how this section works, input rules, and best practices..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button variant="secondary" type="button" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" loading={saving} icon={<Check size={16} />}>
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div>
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100/80 text-gray-800">
                <Info size={18} className="text-indigo-600 mt-0.5 shrink-0" />
                <div className="text-sm leading-relaxed whitespace-pre-line text-gray-700">
                  {data?.content || 'No help text defined yet.'}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                <span className="text-[11px] text-gray-400 font-mono">Key: {sectionKey}</span>

                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <Button variant="secondary" size="sm" icon={<Edit3 size={14} />} onClick={() => setIsEditing(true)}>
                      Edit Help Text
                    </Button>
                  )}
                  <Button size="sm" onClick={() => setOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
