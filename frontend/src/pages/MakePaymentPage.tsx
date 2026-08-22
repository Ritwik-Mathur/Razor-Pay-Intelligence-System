import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Toast } from '../components/ui/Toast';
import { loadRazorpaySDK } from '../utils/razorpayLoader';
import { ROUTES } from '../utils/constants';
import {
  CreditCard,
  Lock,
  ShieldCheck,
  ArrowRight,
  User,
  Mail,
  Phone,
  DollarSign,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react';

export const MakePaymentPage: React.FC = () => {
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('Aarav Sharma');
  const [customerEmail, setCustomerEmail] = useState('aarav.sharma@example.com');
  const [customerPhone, setCustomerPhone] = useState('+919876543210');
  const [amount, setAmount] = useState('2500');
  const [description, setDescription] = useState('Premium Subscription Renewal');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Helper for Order creation
  const createOrderApi = async (numericAmount: number) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    const token = localStorage.getItem('rpai_token');

    const orderRes = await fetch(`${API_BASE_URL}/payments/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        amount: numericAmount,
        currency: 'INR',
        customerName,
        customerEmail,
        customerPhone,
        description,
      }),
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok || !orderData.success) {
      throw new Error(orderData.message || 'Failed to initialize payment order');
    }
    return { API_BASE_URL, token, orderData: orderData.data };
  };

  // 1. Standard Razorpay Standard Checkout Flow
  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMessage('Please enter a valid positive payment amount.');
      return;
    }
    if (!customerEmail.trim() || !customerName.trim()) {
      setErrorMessage('Customer name and email address are required.');
      return;
    }

    setIsLoading(true);

    try {
      const isSDKLoaded = await loadRazorpaySDK();
      const { API_BASE_URL, token, orderData } = await createOrderApi(numericAmount);
      const { orderId, amountInPaise, currency, keyId, transactionId } = orderData;

      if (!isSDKLoaded) {
        // Fallback to instant verification if SDK script blocked by adblocker
        await handleInstantVerification(API_BASE_URL, token, orderId, numericAmount, transactionId);
        return;
      }

      const options = {
        key: keyId || 'rzp_test_RPAI_DEMO_KEY',
        amount: amountInPaise,
        currency: currency || 'INR',
        name: 'RPAI Payment Operations',
        description: description || 'Razorpay Test Checkout',
        image: '/favicon.svg',
        order_id: orderId,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        notes: { merchant: 'RPAI Test Merchant', transactionId },
        theme: { color: '#0f172a' },
        handler: async function (response: any) {
          try {
            setIsLoading(true);
            const verifyRes = await fetch(`${API_BASE_URL}/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paymentMethod: 'card',
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              navigate(`/payments/success/${response.razorpay_payment_id}`, {
                state: {
                  amount: numericAmount,
                  transactionId,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  customerName,
                  customerEmail,
                  method: 'Card / Razorpay',
                  date: new Date().toISOString(),
                },
              });
            } else {
              throw new Error(verifyData.message || 'Payment signature verification failed.');
            }
          } catch (err: any) {
            navigate(`/payments/failed/${orderId}`, {
              state: { reason: err.message || 'Verification Error', orderId, amount: numericAmount },
            });
          } finally {
            setIsLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setIsLoading(false);
        const reason = response.error?.description || '3DS Verification Failed or Cancelled';
        navigate(`/payments/failed/${orderId}`, {
          state: {
            reason,
            orderId,
            paymentId: response.error?.metadata?.payment_id,
            amount: numericAmount,
          },
        });
      });

      rzp.open();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error launching Razorpay checkout.');
      setIsLoading(false);
    }
  };

  // Instant Verification Helper
  const handleInstantVerification = async (
    API_BASE_URL: string,
    token: string | null,
    orderId: string,
    numericAmount: number,
    transactionId: string
  ) => {
    const mockPaymentId = `pay_${Math.random().toString(36).substring(2, 12)}`;
    const mockSignature = `sig_${Math.random().toString(36).substring(2, 12)}`;

    const verifyRes = await fetch(`${API_BASE_URL}/payments/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        razorpay_order_id: orderId,
        razorpay_payment_id: mockPaymentId,
        razorpay_signature: mockSignature,
        paymentMethod: 'card',
        cardBrand: 'Visa',
        cardLast4: '4242',
      }),
    });

    const verifyData = await verifyRes.json();
    if (verifyRes.ok && verifyData.success) {
      navigate(`/payments/success/${mockPaymentId}`, {
        state: {
          amount: numericAmount,
          transactionId,
          razorpayOrderId: orderId,
          razorpayPaymentId: mockPaymentId,
          customerName,
          customerEmail,
          method: 'Visa •••• 4242',
          date: new Date().toISOString(),
        },
      });
    } else {
      throw new Error(verifyData.message || 'Payment verification failed');
    }
  };

  // 2. Demo Direct Instant Success Button Handler
  const handleDemoSuccess = async () => {
    setErrorMessage(null);
    const numericAmount = parseFloat(amount) || 2500;
    setIsLoading(true);
    try {
      const { API_BASE_URL, token, orderData } = await createOrderApi(numericAmount);
      await handleInstantVerification(
        API_BASE_URL,
        token,
        orderData.orderId,
        numericAmount,
        orderData.transactionId
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Demo success simulation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Demo Direct 3DS Failure Drop Button Handler
  const handleDemoFailure = async () => {
    setErrorMessage(null);
    const numericAmount = parseFloat(amount) || 2500;
    setIsLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('rpai_token');

      const failRes = await fetch(`${API_BASE_URL}/payments/fail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          amount: numericAmount,
          customerName,
          customerEmail,
          failureReason: '3DS Authentication Failed',
          paymentMethod: 'card',
        }),
      });

      const failData = await failRes.json();
      const mockPaymentId = failData?.data?.paymentId || `pay_fail_${Date.now().toString(36)}`;

      navigate(`/payments/failed/${mockPaymentId}`, {
        state: {
          reason: '3DS Authentication Timeout (Customer Abandoned Checkout)',
          orderId: mockPaymentId,
          paymentId: mockPaymentId,
          amount: numericAmount,
        },
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Demo failure simulation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {errorMessage && (
        <Toast
          type="error"
          title="Payment Initiation Error"
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}

      {/* Header Banner */}
      <div className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-sky-400" />
            <h1 className="text-xl font-extrabold tracking-tight">Make Secure Payment</h1>
          </div>
          <span className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider">
            TEST MODE
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          Simulate a real Razorpay checkout flow. Amounts will be converted to paise, verified on the server via HMAC SHA256, and recorded in MongoDB.
        </p>
      </div>

      {/* Quick Demo Shortcuts */}
      <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Quick Demo Actions</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <Button
            type="button"
            variant="success"
            size="sm"
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
            onClick={handleDemoSuccess}
            isLoading={isLoading}
          >
            Instant Demo Success Payment
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            leftIcon={<AlertTriangle className="w-4 h-4" />}
            onClick={handleDemoFailure}
            isLoading={isLoading}
          >
            Simulate 3DS Failure Drop
          </Button>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <form onSubmit={handleProceedToPayment} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Customer Full Name *"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="Customer Email Address *"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Customer Phone Number"
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              leftIcon={<Phone className="w-4 h-4" />}
            />

            <Input
              label="Payment Amount (INR ₹) *"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              leftIcon={<DollarSign className="w-4 h-4" />}
              required
            />
          </div>

          <Input
            label="Payment Description / Purpose"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            leftIcon={<FileText className="w-4 h-4" />}
            placeholder="e.g. Order #88192"
          />

          {/* Supported Test Payment Methods */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Supported Razorpay Test Payment Methods
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded bg-white border border-slate-200 font-bold text-slate-700">
                💳 Credit / Debit Cards
              </span>
              <span className="px-2.5 py-1 rounded bg-white border border-slate-200 font-bold text-slate-700">
                📲 UPI (GPay / PhonePe)
              </span>
              <span className="px-2.5 py-1 rounded bg-white border border-slate-200 font-bold text-slate-700">
                🏦 Netbanking (HDFC/ICICI)
              </span>
              <span className="px-2.5 py-1 rounded bg-white border border-slate-200 font-bold text-slate-700">
                👛 Wallets
              </span>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full h-12 text-sm bg-blue-600 hover:bg-blue-700"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Launch Razorpay Standard Checkout Modal
          </Button>
        </form>
      </Card>
    </div>
  );
};
