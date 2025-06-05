import React, { useState, useEffect, useCallback } from 'react';
import { X, Divide, Minus, Plus, Equal } from 'lucide-react';

const Calculator = ({ onClose }) => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [isResult, setIsResult] = useState(false);
  const [mode, setMode] = useState('standard'); // Modes: standard, scientific, medical
  const [memory, setMemory] = useState(0);
  const [bmiData, setBmiData] = useState({ weight: '', height: '' });
  const [unitConversion, setUnitConversion] = useState({
    type: 'mg_to_mcg',
    value: '',
  });
  const [focusedInput, setFocusedInput] = useState('calculator'); // Track which input is focused

  // Handle number and decimal input
  const handleNumber = useCallback((num) => {
    if (isResult) {
      setDisplay(num);
      setExpression(num);
      setIsResult(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
      setExpression(expression + num);
    }
  }, [display, expression, isResult]);

  // Handle operators
  const handleOperator = useCallback((op) => {
    if (isResult) {
      setExpression(display + op);
      setIsResult(false);
    } else {
      setExpression(expression + op);
    }
    setDisplay(op);
  }, [display, expression, isResult]);

  // Clear calculator
  const handleClear = useCallback(() => {
    setDisplay('0');
    setExpression('');
    setIsResult(false);
  }, []);

  // Clear entry
  const handleClearEntry = useCallback(() => {
    setDisplay('0');
  }, []);

  // Backspace
  const handleBackspace = useCallback(() => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  }, [display]);

  // Calculate result
  const handleCalculate = useCallback(() => {
    try {
      // eslint-disable-next-line no-eval
      const result = eval(expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/\^/g, '**'));
      const formattedResult = Number(result.toFixed(10)).toString();
      setDisplay(formattedResult);
      setExpression(formattedResult);
      setIsResult(true);
    } catch {
      setDisplay('Error');
      setExpression('');
      setIsResult(true);
    }
  }, [expression]);

  // Handle keyboard input only for calculator (not other inputs)
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Only handle keyboard for calculator when it's focused or no specific input is focused
      if (focusedInput !== 'calculator') {
        return;
      }

      event.preventDefault();
      const key = event.key;

      if (key >= '0' && key <= '9') {
        handleNumber(key);
      } else if (key === '.') {
        handleNumber('.');
      } else if (key === '+') {
        handleOperator('+');
      } else if (key === '-') {
        handleOperator('-');
      } else if (key === '*') {
        handleOperator('×');
      } else if (key === '/') {
        handleOperator('÷');
      } else if (key === 'Enter' || key === '=') {
        handleCalculate();
      } else if (key === 'Escape') {
        handleClear();
      } else if (key === 'Backspace') {
        handleBackspace();
      } else if (key === 'Delete') {
        handleClearEntry();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumber, handleOperator, handleCalculate, handleClear, handleBackspace, handleClearEntry, focusedInput]);

  // Handle scientific functions
  const handleScientificFunction = (func) => {
    try {
      let result;
      const value = parseFloat(display);
      switch (func) {
        case 'sqrt':
          result = Math.sqrt(value);
          break;
        case 'log':
          result = Math.log10(value);
          break;
        case 'ln':
          result = Math.log(value);
          break;
        case 'sin':
          result = Math.sin((value * Math.PI) / 180);
          break;
        case 'cos':
          result = Math.cos((value * Math.PI) / 180);
          break;
        case 'tan':
          result = Math.tan((value * Math.PI) / 180);
          break;
        case 'exp':
          result = Math.exp(value);
          break;
        case 'pow':
          result = Math.pow(value, 2);
          break;
        case 'reciprocal':
          result = 1 / value;
          break;
        default:
          result = value;
      }
      const formattedResult = Number(result.toFixed(10)).toString();
      setDisplay(formattedResult);
      setExpression(formattedResult);
      setIsResult(true);
    } catch {
      setDisplay('Error');
      setExpression('');
      setIsResult(true);
    }
  };

  // Handle memory functions
  const handleMemory = (action) => {
    const value = parseFloat(display) || 0;
    switch (action) {
      case 'M+':
        setMemory(memory + value);
        break;
      case 'M-':
        setMemory(memory - value);
        break;
      case 'MR':
        setDisplay(memory.toString());
        setExpression(memory.toString());
        setIsResult(true);
        break;
      case 'MC':
        setMemory(0);
        break;
      default:
        break;
    }
  };

  // Handle unit conversion
  const handleUnitConversion = () => {
    const value = parseFloat(unitConversion.value) || 0;
    let result;
    switch (unitConversion.type) {
      case 'mg_to_mcg':
        result = value * 1000;
        break;
      case 'mcg_to_mg':
        result = value / 1000;
        break;
      case 'g_to_mg':
        result = value * 1000;
        break;
      case 'mg_to_g':
        result = value / 1000;
        break;
      case 'kg_to_g':
        result = value * 1000;
        break;
      case 'g_to_kg':
        result = value / 1000;
        break;
      case 'c_to_f':
        result = (value * 9) / 5 + 32;
        break;
      case 'f_to_c':
        result = ((value - 32) * 5) / 9;
        break;
      case 'ml_to_l':
        result = value / 1000;
        break;
      case 'l_to_ml':
        result = value * 1000;
        break;
      default:
        result = value;
    }
    setDisplay(result.toString());
    setExpression(result.toString());
    setIsResult(true);
  };

  // Handle BMI calculation
  const handleBmiCalculate = () => {
    const weight = parseFloat(bmiData.weight);
    const height = parseFloat(bmiData.height) / 100; // Convert cm to meters
    if (weight && height) {
      const bmi = weight / (height * height);
      let category = '';
      if (bmi < 18.5) category = ' (Underweight)';
      else if (bmi < 25) category = ' (Normal)';
      else if (bmi < 30) category = ' (Overweight)';
      else category = ' (Obese)';
      
      setDisplay(bmi.toFixed(2) + category);
      setExpression(`BMI: ${bmi.toFixed(2)}`);
      setIsResult(true);
    } else {
      setDisplay('Error: Enter valid values');
      setExpression('');
      setIsResult(true);
    }
  };

  // Button component for better styling
  const Button = ({ onClick, className = '', children, variant = 'default', size = 'default' }) => {
    const baseClasses = 'rounded-md font-medium transition-all duration-150 hover:scale-105 active:scale-95 shadow-sm';
    const variants = {
      default: 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 hover:border-gray-300',
      primary: 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 border border-gray-600',
      danger: 'bg-red-600 text-white hover:bg-red-700 border border-red-600',
      warning: 'bg-orange-600 text-white hover:bg-orange-700 border border-orange-600',
      success: 'bg-green-600 text-white hover:bg-green-700 border border-green-600'
    };
    const sizes = {
      default: 'p-2 text-sm',
      small: 'p-1 text-xs',
      large: 'p-3 text-base'
    };

    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 w-full max-w-lg mx-auto border border-gray-100" style={{ fontSize: '0.9rem' }}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Calculator
          </span>
        </h3>
        <button 
          onClick={onClose} 
          className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Mode Selection */}
      <div className="flex space-x-1 mb-4">
        {['standard', 'scientific', 'medical'].map((modeOption) => (
          <button
            key={modeOption}
            onClick={() => setMode(modeOption)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all capitalize ${
              mode === modeOption 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {modeOption}
          </button>
        ))}
      </div>

      {/* Display */}
      <div 
        className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-lg mb-4 shadow-inner cursor-pointer"
        onClick={() => setFocusedInput('calculator')}
        onFocus={() => setFocusedInput('calculator')}
        tabIndex={0}
      >
        <div className="text-right">
          <div className="text-gray-400 text-xs font-mono mb-1 min-h-10">
            {expression && !isResult ? expression : ''}
          </div>
          <div className="text-white text-xl font-mono font-bold break-all">
            {display}
          </div>
        </div>
      </div>

      {/* Keyboard hint */}
      <div className="text-xs text-gray-500 text-center mb-3">
        💡 Click display area for keyboard input • ESC=clear • Backspace=delete
      </div>

      {/* Standard Mode */}
      {mode === 'standard' && (
        <div className="grid grid-cols-4 gap-2">
          <Button onClick={handleClear} variant="danger" className="col-span-2">
            Clear
          </Button>
          <Button onClick={handleClearEntry} variant="warning">
            CE
          </Button>
          <Button onClick={handleBackspace} variant="secondary">
            ⌫
          </Button>
          
          <Button onClick={() => handleOperator('(')} variant="secondary">(</Button>
          <Button onClick={() => handleOperator(')')} variant="secondary">)</Button>
          <Button onClick={() => handleOperator('÷')} variant="secondary">
            <Divide size={14} />
          </Button>
          <Button onClick={() => handleScientificFunction('sqrt')} variant="secondary">
            √
          </Button>

          {['7', '8', '9'].map(num => (
            <Button key={num} onClick={() => handleNumber(num)}>{num}</Button>
          ))}
          <Button onClick={() => handleOperator('×')} variant="secondary">×</Button>

          {['4', '5', '6'].map(num => (
            <Button key={num} onClick={() => handleNumber(num)}>{num}</Button>
          ))}
          <Button onClick={() => handleOperator('-')} variant="secondary">
            <Minus size={14} />
          </Button>

          {['1', '2', '3'].map(num => (
            <Button key={num} onClick={() => handleNumber(num)}>{num}</Button>
          ))}
          <Button onClick={() => handleOperator('+')} variant="secondary" className="row-span-2">
            <Plus size={16} />
          </Button>

          <Button onClick={() => handleNumber('0')} className="col-span-2">0</Button>
          <Button onClick={() => handleNumber('.')}>.</Button>

          <Button onClick={handleCalculate} variant="primary" className="col-span-3">
            <Equal size={14} className="mr-1" />
            =
          </Button>
        </div>
      )}

      {/* Scientific Mode */}
      {mode === 'scientific' && (
        <div className="space-y-3">
          {/* Memory Functions */}
          <div className="grid grid-cols-4 gap-1">
            <Button onClick={() => handleMemory('MC')} variant="warning" size="small">MC</Button>
            <Button onClick={() => handleMemory('MR')} variant="warning" size="small">MR</Button>
            <Button onClick={() => handleMemory('M+')} variant="warning" size="small">M+</Button>
            <Button onClick={() => handleMemory('M-')} variant="warning" size="small">M-</Button>
          </div>

          {/* Scientific Functions */}
          <div className="grid grid-cols-4 gap-2">
            <Button onClick={() => handleScientificFunction('sin')} variant="secondary" size="small">sin</Button>
            <Button onClick={() => handleScientificFunction('cos')} variant="secondary" size="small">cos</Button>
            <Button onClick={() => handleScientificFunction('tan')} variant="secondary" size="small">tan</Button>
            <Button onClick={() => handleScientificFunction('log')} variant="secondary" size="small">log</Button>
            
            <Button onClick={() => handleScientificFunction('ln')} variant="secondary" size="small">ln</Button>
            <Button onClick={() => handleScientificFunction('exp')} variant="secondary" size="small">eˣ</Button>
            <Button onClick={() => handleScientificFunction('pow')} variant="secondary" size="small">x²</Button>
            <Button onClick={() => handleScientificFunction('reciprocal')} variant="secondary" size="small">1/x</Button>
          </div>

          {/* Standard calculator buttons */}
          <div className="grid grid-cols-4 gap-2">
            <Button onClick={handleClear} variant="danger" size="small">C</Button>
            <Button onClick={handleClearEntry} variant="warning" size="small">CE</Button>
            <Button onClick={handleBackspace} variant="secondary" size="small">⌫</Button>
            <Button onClick={() => handleOperator('÷')} variant="secondary" size="small">÷</Button>

            {['7', '8', '9'].map(num => (
              <Button key={num} onClick={() => handleNumber(num)} size="small">{num}</Button>
            ))}
            <Button onClick={() => handleOperator('×')} variant="secondary" size="small">×</Button>

            {['4', '5', '6'].map(num => (
              <Button key={num} onClick={() => handleNumber(num)} size="small">{num}</Button>
            ))}
            <Button onClick={() => handleOperator('-')} variant="secondary" size="small">-</Button>

            {['1', '2', '3'].map(num => (
              <Button key={num} onClick={() => handleNumber(num)} size="small">{num}</Button>
            ))}
            <Button onClick={() => handleOperator('+')} variant="secondary" size="small">+</Button>

            <Button onClick={() => handleNumber('0')} size="small" className="col-span-2">0</Button>
            <Button onClick={() => handleNumber('.')} size="small">.</Button>
            <Button onClick={handleCalculate} variant="primary" size="small">=</Button>
          </div>
        </div>
      )}

      {/* Medical Mode */}
      {mode === 'medical' && (
        <div className="space-y-4">
          {/* Unit Conversion */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
            <h4 className="text-sm font-semibold mb-2 text-gray-800">Unit Conversion</h4>
            <select
              value={unitConversion.type}
              onChange={(e) => setUnitConversion({ ...unitConversion, type: e.target.value })}
              onFocus={() => setFocusedInput('unit-select')}
              onBlur={() => setFocusedInput('calculator')}
              className="border border-gray-200 rounded-md px-2 py-1 w-full mb-2 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
            >
              <optgroup label="Weight">
                <option value="mg_to_mcg">mg → mcg</option>
                <option value="mcg_to_mg">mcg → mg</option>
                <option value="g_to_mg">g → mg</option>
                <option value="mg_to_g">mg → g</option>
                <option value="kg_to_g">kg → g</option>
                <option value="g_to_kg">g → kg</option>
              </optgroup>
              <optgroup label="Temperature">
                <option value="c_to_f">Celsius → Fahrenheit</option>
                <option value="f_to_c">Fahrenheit → Celsius</option>
              </optgroup>
              <optgroup label="Volume">
                <option value="ml_to_l">mL → L</option>
                <option value="l_to_ml">L → mL</option>
              </optgroup>
            </select>
            <input
              type="number"
              value={unitConversion.value}
              onChange={(e) => setUnitConversion({ ...unitConversion, value: e.target.value })}
              onFocus={() => setFocusedInput('unit-input')}
              onBlur={() => setFocusedInput('calculator')}
              className="border border-gray-200 rounded-md px-2 py-1 w-full mb-2 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
              placeholder="Enter value to convert"
            />
            <Button onClick={handleUnitConversion} variant="primary" className="w-full" size="small">
              Convert Units
            </Button>
          </div>

          {/* BMI Calculator */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg">
            <h4 className="text-sm font-semibold mb-2 text-gray-800">BMI Calculator</h4>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input
                type="number"
                value={bmiData.weight}
                onChange={(e) => setBmiData({ ...bmiData, weight: e.target.value })}
                onFocus={() => setFocusedInput('bmi-weight')}
                onBlur={() => setFocusedInput('calculator')}
                className="border border-gray-200 rounded-md px-2 py-1 text-xs focus:border-green-500 focus:ring-1 focus:ring-green-200"
                placeholder="Weight (kg)"
              />
              <input
                type="number"
                value={bmiData.height}
                onChange={(e) => setBmiData({ ...bmiData, height: e.target.value })}
                onFocus={() => setFocusedInput('bmi-height')}
                onBlur={() => setFocusedInput('calculator')}
                className="border border-gray-200 rounded-md px-2 py-1 text-xs focus:border-green-500 focus:ring-1 focus:ring-green-200"
                placeholder="Height (cm)"
              />
            </div>
            <Button onClick={handleBmiCalculate} variant="success" className="w-full" size="small">
              Calculate BMI
            </Button>
            <div className="text-xs text-gray-600 mt-1">
              BMI Categories: &lt;18.5 Underweight • 18.5-24.9 Normal • 25-29.9 Overweight • ≥30 Obese
            </div>
          </div>

          {/* Basic Calculator */}
          <div className="grid grid-cols-4 gap-1">
            <Button onClick={handleClear} variant="danger" size="small">C</Button>
            <Button onClick={() => handleOperator('÷')} variant="secondary" size="small">÷</Button>
            <Button onClick={() => handleOperator('×')} variant="secondary" size="small">×</Button>
            <Button onClick={handleBackspace} variant="secondary" size="small">⌫</Button>

            {['7', '8', '9'].map(num => (
              <Button key={num} onClick={() => handleNumber(num)} size="small">{num}</Button>
            ))}
            <Button onClick={() => handleOperator('-')} variant="secondary" size="small">-</Button>

            {['4', '5', '6'].map(num => (
              <Button key={num} onClick={() => handleNumber(num)} size="small">{num}</Button>
            ))}
            <Button onClick={() => handleOperator('+')} variant="secondary" size="small">+</Button>

            {['1', '2', '3'].map(num => (
              <Button key={num} onClick={() => handleNumber(num)} size="small">{num}</Button>
            ))}
            <Button onClick={handleCalculate} variant="primary" size="small" className="row-span-2">=</Button>

            <Button onClick={() => handleNumber('0')} size="small" className="col-span-2">0</Button>
            <Button onClick={() => handleNumber('.')} size="small">.</Button>
          </div>
        </div>
      )}

      {/* Memory indicator */}
      {memory !== 0 && (
        <div className="mt-3 text-center">
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
            Memory: {memory}
          </span>
        </div>
      )}
    </div>
  );
};

export default Calculator;