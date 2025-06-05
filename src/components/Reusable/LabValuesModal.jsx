// LabValuesModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowLeft, Search, FlaskConical, Wind, Activity, Droplets, Beaker, Ruler, ChevronUp, ChevronDown } from 'lucide-react';
import { labValues } from '../../data/labValues';

const LabValuesModal = ({ onClose }) => {
  const [view, setView] = useState('categories');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSubcategory, setExpandedSubcategory] = useState(0);
  const labValuesRef = useRef(null);

  const categories = Object.keys(labValues);

  useEffect(() => {
    if (view === 'categories') {
      setSearchQuery('');
    }
  }, [view]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setView('values');
    setExpandedSubcategory(0);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setView('categories');
    setExpandedSubcategory(null);
  };

  const filterCategories = (category) => {
    if (!searchQuery) return true;
    const categoryName = labValues[category].name.toLowerCase();
    return categoryName.includes(searchQuery.toLowerCase());
  };

  const filterLabValues = (values) => {
    if (!searchQuery) return values;
    return values.filter((v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.value.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getCategoryIcon = (category) => {
    const iconProps = { size: 24, className: "text-gray-600 dark:text-gray-200" };
    switch (category) {
      case 'serum': return <FlaskConical {...iconProps} />;
      case 'blood_gases': return <Wind {...iconProps} />;
      case 'csf': return <Activity {...iconProps} />;
      case 'hematologic': return <Droplets {...iconProps} />;
      case 'urine': return <Beaker {...iconProps} />;
      case 'body_metrics': return <Ruler {...iconProps} />;
      default: return <Beaker {...iconProps} />;
    }
  };

  const getCategoryGradient = (category) => {
    switch (category) {
      case 'serum': return 'bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800';
      case 'blood_gases': return 'bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900 dark:to-red-800';
      case 'csf': return 'bg-gradient-to-r from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-800';
      case 'hematologic': return 'bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800';
      case 'urine': return 'bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800';
      case 'body_metrics': return 'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900 dark:to-green-800';
      default: return 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700';
    }
  };

  const getCategoryBorderColor = (category) => {
    switch (category) {
      case 'serum': return 'border-blue-500';
      case 'blood_gases': return 'border-red-500';
      case 'csf': return 'border-indigo-500';
      case 'hematologic': return 'border-purple-500';
      case 'urine': return 'border-yellow-500';
      case 'body_metrics': return 'border-green-500';
      default: return 'border-gray-500';
    }
  };

  const getCategoryTextColor = (category) => {
    switch (category) {
      case 'serum': return 'text-blue-700 dark:text-blue-300';
      case 'blood_gases': return 'text-red-700 dark:text-red-300';
      case 'csf': return 'text-indigo-700 dark:text-indigo-300';
      case 'hematologic': return 'text-purple-700 dark:text-purple-300';
      case 'urine': return 'text-yellow-700 dark:text-yellow-300';
      case 'body_metrics': return 'text-green-700 dark:text-green-300';
      default: return 'text-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-full ${view === 'values' ? getCategoryBorderColor(selectedCategory) : 'border-gray-100 dark:border-gray-700'} border-t-4`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {view === 'categories' ? 'Laboratory Reference Values' : labValues[selectedCategory]?.name || 'Lab Values'}
        </h3>
        <button 
          onClick={onClose} 
          className="text-gray-400 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 p-1 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="mb-6">
        {view === 'values' ? (
          <button 
            onClick={handleBackToCategories}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline text-sm transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Categories
          </button>
        ) : (
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search lab categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-all"
            />
          </div>
        )}
      </div>

      {view === 'categories' && (
        <div className="grid grid-cols-2 gap-6">
          {categories.filter(filterCategories).map((category) => (
            <div
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`p-4 rounded-lg cursor-pointer transition-all transform hover:scale-105 shadow-md ${getCategoryGradient(category)} border border-gray-200 dark:border-gray-600`}
            >
              <div className="flex items-center mb-3">
                {getCategoryIcon(category)}
                <h3 className={`ml-3 text-lg font-semibold ${getCategoryTextColor(category)}`}>
                  {labValues[category].name}
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {category === 'serum' && 'Chemistry, electrolytes, and other serum tests'}
                {category === 'blood_gases' && 'Arterial and venous blood gas measurements'}
                {category === 'csf' && 'Cerebrospinal fluid analysis values'}
                {category === 'hematologic' && 'Complete blood count and coagulation tests'}
                {category === 'urine' && 'Urinalysis and urine chemistry values'}
                {category === 'body_metrics' && 'Vital signs and body measurement references'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {labValues[category].subcategories.length} subcategories
              </p>
            </div>
          ))}
          {searchQuery && categories.filter(filterCategories).length === 0 && (
            <p className="col-span-2 text-center text-gray-500 dark:text-gray-400 text-sm">
              No lab categories found matching "{searchQuery}"
            </p>
          )}
        </div>
      )}

      {view === 'values' && selectedCategory && (
        <div>
          <div className="relative w-full mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search lab values..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-all"
            />
          </div>

          {labValues[selectedCategory].subcategories.map((subcategory, index) => {
            const filteredValues = filterLabValues(subcategory.values);
            if (searchQuery && filteredValues.length === 0) return null;

            return (
              <div key={index} className="mb-6">
                <div
                  className={`p-4 flex justify-between items-center cursor-pointer rounded-lg ${expandedSubcategory === index ? 'bg-blue-50 dark:bg-gray-700' : 'bg-gray-50 dark:bg-gray-900'} hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors`}
                  onClick={() => setExpandedSubcategory(expandedSubcategory === index ? null : index)}
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{subcategory.name}</h3>
                  <button className="p-1">
                    {expandedSubcategory === index ? (
                      <ChevronUp className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                    )}
                  </button>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSubcategory === index ? 'max-h-[1000px]' : 'max-h-0'}`}
                >
                  <table className="w-full text-sm border-collapse mt-2">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700">
                        <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-200">Test</th>
                        <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-200">Normal Range</th>
                        <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-200">SI Units</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredValues.map((value, valueIndex) => (
                        <tr
                          key={valueIndex}
                          className={`border-b border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors ${valueIndex % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}`}
                        >
                          <td className="p-3 font-medium text-gray-800 dark:text-gray-200">{value.name}</td>
                          <td className="p-3 text-blue-800 dark:text-blue-300 font-semibold">{value.value}</td>
                          <td className="p-3 text-gray-600 dark:text-gray-400">{value.si_value || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
          {searchQuery &&
            !labValues[selectedCategory].subcategories.some((sub) => filterLabValues(sub.values).length > 0) && (
              <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                No lab values found matching "{searchQuery}"
              </p>
            )}
        </div>
      )}
    </div>
  );
};

export default LabValuesModal;