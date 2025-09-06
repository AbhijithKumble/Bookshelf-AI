import { useState } from 'react';
import { Upload, BookOpen, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import Papa from 'papaparse';

const BookshelfAnalyzer = () => {
  const [step, setStep] = useState<Number>(1);
  const [imageFile, setImageFile] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [detectedBooks, setDetectedBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [goodreadsBooks, setGoodreadsBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock function to simulate backend API call for book detection
  const detectBooksFromImage = async (imageFile) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock detected books data
    return [
      "The Great Gatsby",
      "To Kill a Mockingbird",
      "1984",
      "Pride and Prejudice",
      "The Catcher in the Rye",
      "Lord of the Flies",
      "Animal Farm",
      "Brave New World"
    ];
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setLoading(true);
    setError('');

    try {
      const books = await detectBooksFromImage(file);
      setDetectedBooks(books);
      setStep(2);
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCsvFile(file);
    setLoading(true);
    setError('');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        try {
          const books = results.data.map(row => ({
            title: (row.Title || row.title || '').toString().trim(),
            author: (row.Author || row.author || '').toString().trim(),
            rating: parseFloat(row['My Rating'] || row['my rating'] || row.rating || 0),
            dateRead: row['Date Read'] || row['date read'] || row.date_read || '',
            shelf: row.Shelf || row.shelf || ''
          })).filter(book => book.title);

          setGoodreadsBooks(books);

          // Find recommendations based on highly rated books
          const highlyRated = books.filter(book => book.rating >= 4);
          const recommended = detectedBooks.filter(detectedBook =>
            !books.some(book =>
              book.title.toLowerCase().includes(detectedBook.toLowerCase()) ||
              detectedBook.toLowerCase().includes(book.title.toLowerCase())
            )
          );

          setRecommendedBooks(recommended);
          setStep(3);
        } catch (err) {
          setError('Failed to process CSV file. Please check the format.');
        } finally {
          setLoading(false);
        }
      },
      error: (error) => {
        setError('Failed to read CSV file. Please try again.');
        setLoading(false);
      }
    });
  };

  const resetApp = () => {
    setStep(1);
    setImageFile(null);
    setCsvFile(null);
    setDetectedBooks([]);
    setRecommendedBooks([]);
    setGoodreadsBooks([]);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">Bookshelf Analyzer</h1>
          </div>
          <p className="text-gray-600">Discover books from your shelf that match your reading preferences</p>
        </header>

        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 1 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'
                }`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Upload Image</span>
            </div>
            <div className={`w-8 h-0.5 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
            <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 2 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'
                }`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Upload CSV</span>
            </div>
            <div className={`w-8 h-0.5 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`} />
            <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= 3 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'
                }`}>
                3
              </div>
              <span className="ml-2 text-sm font-medium">Results</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Step 1: Image Upload */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-semibold mb-4">Step 1: Upload Bookshelf Image</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Upload an image of your bookshelf</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={loading}
              />
              <label
                htmlFor="image-upload"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Image...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Image
                  </>
                )}
              </label>
            </div>
          </div>
        )}

        {/* Step 2: CSV Upload */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-semibold mb-4">Step 2: Upload Goodreads CSV</h2>

            {detectedBooks.length > 0 && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-800">
                    Detected {detectedBooks.length} books from your shelf
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                  {detectedBooks.map((book, index) => (
                    <span key={index} className="text-sm bg-white px-3 py-1 rounded border">
                      {book}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Upload your Goodreads CSV export</p>
              <p className="text-sm text-gray-500 mb-4">
                Export from Goodreads: My Books → Tools → Export Library
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleCsvUpload}
                className="hidden"
                id="csv-upload"
                disabled={loading}
              />
              <label
                htmlFor="csv-upload"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Processing CSV...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Choose CSV File
                  </>
                )}
              </label>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl font-semibold mb-4">Recommended Books from Your Shelf</h2>

              {recommendedBooks.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-gray-600 mb-4">
                    Based on your Goodreads history, these books from your shelf might interest you:
                  </p>
                  <div className="grid gap-3">
                    {recommendedBooks.map((book, index) => (
                      <div key={index} className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <BookOpen className="w-5 h-5 text-blue-600 mr-3" />
                        <span className="font-medium text-gray-900">{book}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    It looks like you've already read most of the books we detected, or they don't match your typical preferences.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-lg font-semibold mb-4">Analysis Summary</h3>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{detectedBooks.length}</div>
                  <div className="text-sm text-gray-600">Books Detected</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{goodreadsBooks.length}</div>
                  <div className="text-sm text-gray-600">Goodreads Books</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{recommendedBooks.length}</div>
                  <div className="text-sm text-gray-600">Recommendations</div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={resetApp}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Analyze Another Shelf
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookshelfAnalyzer;
