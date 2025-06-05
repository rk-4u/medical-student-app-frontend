import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, PlusCircle, Upload, Image, File, CheckCircle, Plus, Trash2, Link } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { categorizedData } from '../../data/categorizedData';

const CreateQuestion = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    categories: ['Basic Sciences'],
    subjects: [],
    topics: {},
    questionText: '',
    options: [{ text: '', media: [] }, { text: '', media: [] }],
    correctAnswer: null,
    explanation: { text: '', media: [] },
    media: [],
    difficulty: 'medium',
    sourceUrl: '',
  });

  const [activeSubject, setActiveSubject] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFor, setUploadingFor] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [urlInput, setUrlInput] = useState('');
  const [mediaType, setMediaType] = useState('file');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  useEffect(() => {
    if (formData.subjects.length === 1) {
      setActiveSubject(formData.subjects[0]);
    } else if (!formData.subjects.includes(activeSubject)) {
      setActiveSubject(formData.subjects[0] || null);
    }
  }, [formData.subjects]);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      return 'Invalid file type. Only JPEG, PNG, GIF, MP4, and WEBM are allowed.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 10MB limit.';
    }
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name === 'explanation' ? 'explanation' : name]: name === 'explanation' ? { ...formData.explanation, text: value } : value,
    });
    setErrorMessage('');
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index] = { ...updatedOptions[index], text: value };
    setFormData({ ...formData, options: updatedOptions });
  };

  const handleCorrectAnswerSelect = (index) => {
    setFormData({ ...formData, correctAnswer: index });
  };

  const handleCategoryChange = (category) => {
    setFormData({
      ...formData,
      categories: [category],
      subjects: [],
      topics: {},
    });
    setActiveSubject(null);
  };

  const handleSubjectToggle = (subject) => {
    const updatedSubjects = formData.subjects.includes(subject)
      ? formData.subjects.filter((s) => s !== subject)
      : [...formData.subjects, subject];
    const updatedTopics = { ...formData.topics };
    if (!updatedSubjects.includes(subject)) {
      delete updatedTopics[subject];
    }
    setFormData({
      ...formData,
      subjects: updatedSubjects,
      topics: updatedTopics,
    });
  };

  const handleTopicToggle = (topic) => {
    if (!activeSubject) return;
    const subjectTopics = formData.topics[activeSubject] || [];
    const updatedSubjectTopics = subjectTopics.includes(topic)
      ? subjectTopics.filter((t) => t !== topic)
      : [...subjectTopics, topic];
    setFormData({
      ...formData,
      topics: {
        ...formData.topics,
        [activeSubject]: updatedSubjectTopics,
      },
    });
  };

  const handleAddOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { text: '', media: [] }],
    });
  };

  const handleRemoveOption = (index) => {
    if (formData.options.length <= 2) {
      setErrorMessage('Minimum 2 options required');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    const updatedOptions = [...formData.options];
    updatedOptions.splice(index, 1);
    const newCorrectAnswer = formData.correctAnswer === index ? null : formData.correctAnswer > index ? formData.correctAnswer - 1 : formData.correctAnswer;
    setFormData({
      ...formData,
      options: updatedOptions,
      correctAnswer: newCorrectAnswer,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const invalidFileError = files.find((file) => validateFile(file));
      if (invalidFileError) {
        setUploadError(validateFile(invalidFileError));
        return;
      }
      setUploadedFiles(files);
      setUploadSuccess(false);
      setUploadError('');
    }
  };

  const handleUploadMedia = async () => {
    if (!uploadedFiles.length && !urlInput.trim()) {
      setUploadError('Please select a file or enter a URL');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      let mediaUrls = [];

      if (mediaType === 'file' && uploadedFiles.length) {
        const { data } = await axios.get('https://medical-student-app-backend.onrender.com/api/upload/signature', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const uploadPromises = uploadedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', data.uploadPreset);
          formData.append('timestamp', data.timestamp);
          formData.append('signature', data.signature);
          formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);

          const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${data.cloudName}/auto/upload`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );
          return response.data.secure_url;
        });

        mediaUrls = await Promise.all(uploadPromises);
      } else if (mediaType === 'url' && urlInput.trim()) {
        if (!validateUrl(urlInput.trim())) {
          throw new Error('Invalid URL format');
        }
        mediaUrls = [urlInput.trim()];
      }

      if (uploadingFor === 'question') {
        setFormData({
          ...formData,
          media: [...formData.media, ...mediaUrls],
        });
      } else if (uploadingFor === 'explanation') {
        setFormData({
          ...formData,
          explanation: { ...formData.explanation, media: [...formData.explanation.media, ...mediaUrls] },
        });
      } else if (typeof uploadingFor === 'number') {
        const updatedOptions = [...formData.options];
        updatedOptions[uploadingFor] = {
          ...updatedOptions[uploadingFor],
          media: [...updatedOptions[uploadingFor].media, ...mediaUrls],
        };
        setFormData({ ...formData, options: updatedOptions });
      }

      setUploadSuccess(true);
      setUploadedFiles([]);
      setUrlInput('');
      setTimeout(() => setUploadingFor(null), 1000);
    } catch (error) {
      setUploadError(error.response?.data?.message || error.message || 'Failed to upload media');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveUploadedMedia = (target, index) => {
    if (target === 'question') {
      const updatedMedia = [...formData.media];
      updatedMedia.splice(index, 1);
      setFormData({ ...formData, media: updatedMedia });
    } else if (target === 'explanation') {
      const updatedMedia = [...formData.explanation.media];
      updatedMedia.splice(index, 1);
      setFormData({ ...formData, explanation: { ...formData.explanation, media: updatedMedia } });
    } else if (typeof target === 'number') {
      const updatedOptions = [...formData.options];
      updatedOptions[target].media.splice(index, 1);
      setFormData({ ...formData, options: updatedOptions });
    }
    if (uploadingFor === target) {
      setUploadedFiles([]);
      setUrlInput('');
      setUploadSuccess(false);
      setUploadError('');
    }
  };

  const handleCancelUpload = () => {
    setUploadingFor(null);
    setUploadedFiles([]);
    setUrlInput('');
    setMediaType('file');
    setUploadSuccess(false);
    setUploadError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.questionText.trim()) {
      setErrorMessage('Question text is required');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    if (formData.options.some((option) => !option.text.trim())) {
      setErrorMessage('All options must be filled');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    if (formData.correctAnswer === null) {
      setErrorMessage('Please select a correct answer');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    if (formData.subjects.length === 0) {
      setErrorMessage('At least one subject is required');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    if (!formData.explanation.text.trim()) {
      setErrorMessage('Explanation is required');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    if (!token) {
      setErrorMessage('Authentication required. Please log in again.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      const submissionData = {
        categories: formData.categories,
        subjects: formData.subjects,
        topics: Object.values(formData.topics).flat(),
        questionText: formData.questionText,
        options: formData.options,
        correctAnswers: [formData.correctAnswer],
        explanation: formData.explanation,
        media: formData.media,
        difficulty: formData.difficulty,
        sourceUrl: formData.sourceUrl || '',
      };
      await axios.post('https://medical-student-app-backend.onrender.com/api/questions', submissionData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage('Question created successfully!');
      setFormData({
        categories: ['Basic Sciences'],
        subjects: [],
        topics: {},
        questionText: '',
        options: [{ text: '', media: [] }, { text: '', media: [] }],
        correctAnswer: null,
        explanation: { text: '', media: [] },
        media: [],
        difficulty: 'medium',
        sourceUrl: '',
      });
      setActiveSubject(null);
      setTimeout(() => {
        setSuccessMessage('');
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to create question');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMediaButton = (target, media) => (
    <div className="mt-3">
      {media.length > 0 && (
        <div className="space-y-2 mb-3">
          {media.map((mediaUrl, index) => (
            <div
              key={index}
              className="flex items-center p-2 bg-white/30 dark:bg-black/20 backdrop-blur-md border border-white/40 dark:border-gray-700/30 rounded-md text-sm"
            >
              <div className="flex items-center flex-1 overflow-hidden">
                {mediaUrl.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                  <Image className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-300" />
                ) : mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                  <File className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-300" />
                ) : (
                  <Link className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-300" />
                )}
                <span className="truncate text-gray-900 dark:text-gray-300">
                  {mediaUrl.split('/').pop()}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveUploadedMedia(target, index)}
                className="ml-2 p-1 text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => setUploadingFor(target)}
        className="flex items-center text-sm text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200"
      >
        <PlusCircle size={14} className="mr-1" />
        Add Media or URL
      </button>
    </div>
  );

  const renderSelectedSummary = () => (
    <div className="mt-6 p-4 bg-white/30 dark:bg-black/20 backdrop-blur-md rounded-lg border border-white/40 dark:border-gray-700/30">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-2">Selected Classification</h3>
      <div className="ml-4">
        <p className="text-gray-900 dark:text-gray-300">
          <strong>Category:</strong> {formData.categories[0] || 'None'}
        </p>
        {formData.subjects.length > 0 ? (
          <div className="ml-4 mt-2">
            <p className="text-gray-900 dark:text-gray-300 font-medium">Subjects:</p>
            {formData.subjects.map((subject) => (
              <div key={subject} className="ml-4">
                <p className="text-gray-900 dark:text-gray-300">{subject}</p>
                {formData.topics[subject]?.length > 0 && (
                  <div className="ml-4">
                    <p className="text-gray-900 dark:text-gray-300 font-medium">Topics:</p>
                    <ul className="list-disc ml-6">
                      {formData.topics[subject].map((topic) => (
                        <li key={topic} className="text-gray-900 dark:text-gray-300">{topic}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="ml-4 text-gray-900 dark:text-gray-300">No subjects selected</p>
        )}
      </div>
    </div>
  );

  const renderSubjectTabs = () => {
    if (formData.subjects.length <= 1) return null;
    return (
      <div className="flex space-x-2 mb-4">
        {formData.subjects.map((subject) => (
          <button
            key={subject}
            type="button"
            onClick={() => setActiveSubject(subject)}
            className={`px-3 py-1 rounded-lg font-medium ${
              activeSubject === subject
                ? 'bg-blue-600/90 text-white'
                : 'bg-white/30 dark:bg-black/10 text-gray-900 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-black/20'
            } border border-white/40 dark:border-gray-700/30`}
          >
            {subject}
          </button>
        ))}
      </div>
    );
  };

  const renderTopics = () => {
    if (!activeSubject) return null;
    const subjectData = categorizedData
      .find((cat) => cat.category === formData.categories[0])
      ?.subjects.find((sub) => sub.name === activeSubject);
    if (!subjectData) return null;
    return (
      <div>
        <label className="block text-gray-900 dark:text-gray-200 font-medium mb-2">Topics for {activeSubject}</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {subjectData.topics.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => handleTopicToggle(topic)}
              className={`py-2 px-3 rounded-lg text-sm font-medium border border-white/40 dark:border-gray-700/30 ${
                formData.topics[activeSubject]?.includes(topic)
                  ? 'bg-green-600/90 dark:bg-green-600/80 text-white'
                  : 'bg-white/30 dark:bg-black/10 text-gray-900 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-black/20'
              } backdrop-blur-sm`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-8">
      <div className="w-full max-w-7xl mx-auto bg-white/20 dark:bg-black/10 backdrop-blur-lg rounded-xl shadow-lg p-8 border border-white/30 dark:border-gray-800/20">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-200 mb-8">Create New Question</h2>

        {successMessage && (
          <div className="mb-6 bg-green-600/30 dark:bg-green-600/20 border border-green-500/40 dark:border-green-500/30 text-green-900 dark:text-green-200 px-4 py-3 rounded-lg backdrop-blur-md flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 bg-red-600/30 dark:bg-red-600/20 border border-red-500/40 dark:border-red-500/30 text-red-900 dark:text-red-200 px-4 py-3 rounded-lg backdrop-blur-md">
            {errorMessage}
          </div>
        )}

        {uploadingFor !== null && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white/20 dark:bg-black/10 backdrop-blur-lg rounded-xl p-6 w-full max-w-lg border border-white/40 dark:border-gray-800/20">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-200">
                Add Media for{' '}
                {uploadingFor === 'question'
                  ? 'Question'
                  : uploadingFor === 'explanation'
                  ? 'Explanation'
                  : `Option ${String.fromCharCode(65 + uploadingFor)}`}
              </h3>
              <div className="mb-4 flex space-x-4">
                <label className="flex items-center text-gray-900 dark:text-gray-300">
                  <input
                    type="radio"
                    name="mediaType"
                    value="file"
                    checked={mediaType === 'file'}
                    onChange={() => setMediaType('file')}
                    className="mr-2 accent-blue-600"
                  />
                  Upload File
                </label>
                <label className="flex items-center text-gray-900 dark:text-gray-300">
                  <input
                    type="radio"
                    name="mediaType"
                    value="url"
                    checked={mediaType === 'url'}
                    onChange={() => setMediaType('url')}
                    className="mr-2 accent-blue-600"
                  />
                  Paste URL
                </label>
              </div>
              {mediaType === 'file' && !uploadedFiles.length ? (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-white/30 dark:bg-black/10 backdrop-blur-sm border-white/40 dark:border-gray-700/30">
                    <div className="flex flex-col items-center">
                      <Upload className="w-8 h-8 mb-2 text-gray-700 dark:text-gray-300" />
                      <p className="text-sm text-gray-700 dark:text-gray-300">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Images, videos (MAX. 10MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/jpeg,image/png,image/gif,video/mp4,video/webm"
                      multiple
                    />
                  </label>
                </div>
              ) : mediaType === 'file' && uploadedFiles.length > 0 ? (
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-white/30 dark:bg-black/20 rounded-md border border-white/40 dark:border-gray-700/30"
                    >
                      <span className="truncate text-gray-900 dark:text-gray-300">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))}
                        className="p-1 text-red-500 hover:text-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Paste URL (e.g., https://example.com/image.jpg)"
                    className="w-full px-3 py-2 border border-white/40 dark:border-gray-700/30 rounded-md bg-white/30 dark:bg-black/10 backdrop-blur-sm text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={handleUploadMedia}
                    disabled={isUploading}
                    className={`px-4 py-2 rounded-lg ${
                      isUploading
                        ? 'bg-gray-500/80 dark:bg-gray-500/80 cursor-not-allowed'
                        : 'bg-blue-600/90 dark:bg-blue-600/80 hover:bg-blue-700/95 dark:hover:bg-blue-500/90 text-white'
                    } backdrop-blur-sm border border-white/40 dark:border-gray-700/20`}
                  >
                    {isUploading ? 'Adding...' : 'Add URL'}
                  </button>
                </div>
              )}
              {uploadError && <p className="text-red-700 dark:text-red-300 mt-2">{uploadError}</p>}
              {uploadSuccess && (
                <p className="text-green-700 dark:text-green-300 mt-2 flex items-center">
                  <CheckCircle size={16} className="mr-1" />
                  {mediaType === 'file' ? 'Files uploaded!' : 'URL added!'}
                </p>
              )}
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  type="button"
                  onClick={handleCancelUpload}
                  className="px-4 py-2 border border-white/40 dark:border-gray-700/30 text-gray-900 dark:text-gray-300 rounded-lg hover:bg-white/40 dark:hover:bg-black/20 backdrop-blur-sm"
                >
                  Cancel
                </button>
                {mediaType === 'file' && uploadedFiles.length > 0 && !uploadSuccess && (
                  <button
                    type="button"
                    onClick={handleUploadMedia}
                    disabled={isUploading}
                    className={`px-4 py-2 rounded-lg ${
                      isUploading
                        ? 'bg-gray-500/80 dark:bg-gray-500/80 cursor-not-allowed'
                        : 'bg-blue-600/90 dark:bg-blue-600/80 hover:bg-blue-700/95 dark:hover:bg-blue-500/90 text-white'
                    } backdrop-blur-sm border border-white/40 dark:border-gray-700/20`}
                  >
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </button>
                )}
                {uploadSuccess && (
                  <button
                    type="button"
                    onClick={() => setUploadingFor(null)}
                    className="px-4 py-2 bg-green-600/90 dark:bg-green-600/80 text-white rounded-lg hover:bg-green-700/95 dark:hover:bg-green-500/90 backdrop-blur-sm border border-white/40 dark:border-gray-700/20"
                  >
                    Done
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-gray-900 dark:text-gray-200 font-medium mb-2">Question Text*</label>
            <textarea
              name="questionText"
              value={formData.questionText}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-white/40 dark:border-gray-700/30 rounded-md bg-white/30 dark:bg-black/10 backdrop-blur-sm text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              rows="5"
              placeholder="Enter the question text here..."
              required
            />
            {renderMediaButton('question', formData.media)}
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-gray-900 dark:text-gray-200 font-medium">
                Options* (Select the correct answer)
              </label>
              <button
                type="button"
                onClick={handleAddOption}
                className="flex items-center text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200"
              >
                <Plus size={16} className="mr-1" /> Add Option
              </button>
            </div>
            <div className="space-y-4">
              {formData.options.map((option, index) => (
                <div key={index} className="flex flex-col">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={formData.correctAnswer === index}
                      onChange={() => handleCorrectAnswerSelect(index)}
                      className="accent-blue-600"
                    />
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="flex-grow px-4 py-2 border border-white/40 dark:border-gray-700/30 rounded-md bg-white/30 dark:bg-black/10 backdrop-blur-sm text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="p-1 text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  {renderMediaButton(index, option.media)}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-900 dark:text-gray-200 font-medium mb-2">Explanation*</label>
            <textarea
              name="explanation"
              value={formData.explanation.text}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-white/40 dark:border-gray-700/30 rounded-md bg-white/30 dark:bg-black/10 backdrop-blur-sm text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              rows="5"
              placeholder="Explain the correct answer..."
              required
            />
            {renderMediaButton('explanation', formData.explanation.media)}
          </div>

          <div>
            <label className="block text-gray-900 dark:text-gray-200 font-medium mb-2">Difficulty*</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-white/40 dark:border-gray-700/30 rounded-md bg-white/30 dark:bg-black/10 backdrop-blur-sm text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-900 dark:text-gray-200 font-medium mb-2">Category*</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categorizedData.map((cat) => (
                <button
                  key={cat.category}
                  type="button"
                  onClick={() => handleCategoryChange(cat.category)}
                  className={`py-3 text-center font-medium rounded-lg border border-white/40 dark:border-gray-700/30 ${
                    formData.categories[0] === cat.category
                      ? 'bg-blue-600/90 dark:bg-blue-600/80 text-white'
                      : 'bg-white/30 dark:bg-black/10 text-gray-900 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-black/20'
                  } backdrop-blur-sm`}
                >
                  {cat.category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-900 dark:text-gray-200 font-medium mb-2">Subjects*</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {categorizedData
                .find((cat) => cat.category === formData.categories[0])
                ?.subjects.map((subject) => (
                  <button
                    key={subject.name}
                    type="button"
                    onClick={() => handleSubjectToggle(subject.name)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium border border-white/40 dark:border-gray-700/30 ${
                      formData.subjects.includes(subject.name)
                        ? 'bg-blue-600/90 dark:bg-blue-600/80 text-white'
                        : 'bg-white/30 dark:bg-black/10 text-gray-900 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-black/20'
                    } backdrop-blur-sm`}
                  >
                    {subject.name}
                  </button>
                ))}
            </div>
          </div>

          {formData.subjects.length > 0 && (
            <div>
              {renderSubjectTabs()}
              {renderTopics()}
            </div>
          )}

          <div>
            <label className="block text-gray-900 dark:text-gray-200 font-medium mb-2">Source URL (Optional)</label>
            <input
              type="url"
              name="sourceUrl"
              value={formData.sourceUrl}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-white/40 dark:border-gray-700/30 rounded-md bg-white/30 dark:bg-black/10 backdrop-blur-sm text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="https://example.com"
            />
          </div>

          {renderSelectedSummary()}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 border border-white/40 dark:border-gray-700/30 text-gray-900 dark:text-gray-300 rounded-lg hover:bg-white/40 dark:hover:bg-black/20 backdrop-blur-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-lg font-medium backdrop-blur-sm border border-white/40 dark:border-gray-700/20 ${
                isSubmitting
                  ? 'bg-gray-500/80 dark:bg-gray-500/80 cursor-not-allowed'
                  : 'bg-blue-600/90 dark:bg-blue-600/80 hover:bg-blue-700/95 dark:hover:bg-blue-500/90 text-white'
              }`}
            >
              {isSubmitting ? 'Creating...' : 'Create Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuestion;