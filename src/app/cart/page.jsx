'use client';
import React, { use, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/services/cartServices';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import api from '@/services/api';
import { handleError } from '@/utility/handleError';
import { useRouter } from 'next/navigation';
import { useNotificationContext } from '../context/ShowNotification';
import { formatIDRCustom } from '@/utility/general';



export default function page() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showNotification } = useNotificationContext();

  const [discountCode, setDiscountCode] = useState('');
  const [step, setStep] = useState(1);
  const { data: cartData, isCartLoading, isCartError } = useCart();
  useEffect(() => {
    queryClient.invalidateQueries(['cartList']);
  }, []);



  const handleRemoveItem = async (id, productId) => {
    try {
      const res = await api.post(`/api/Cart/Remove`, { id, productId });
      if (res?.data?.isSuccess && res?.data?.statusCode === 200) {
        showNotification({
          message: res.data.message,
          variant: 'success',
        });
      } else {
        if (router && res?.data?.statusCode !== 200) {
          handleError(res.data.statusCode, router);
        }
        showNotification({
          message: res?.data?.message || 'Something went wrong',
          variant: 'error',
        });
      }
    } catch (err) {
      if (router) {
        handleError(err?.response?.status, router);
      }
      showNotification({
        message: err?.response?.data?.message || 'Something went wrong',
        variant: 'error',
      })
    } finally {
      queryClient.invalidateQueries(['cartList']);
    }
  }
  const handleUpdateQuantity = async (id, productId, quantity) => {
    try {
      const res = await api.post(`/api/Cart/UpdateCartItem`, { id, productId, quantity });
      if (res?.data?.isSuccess && res?.data?.statusCode === 200) {
        showNotification({
          message: res?.data?.message,
          variant: 'success',
        });
      } else {
        if (router && res?.data?.statusCode !== 200) {
          handleError(res?.data?.statusCode, router);
        }
        showNotification({
          message: res?.data?.message || 'Something went wrong',
          variant: 'error',
        });
      }
    } catch (err) {
      if (router) {
        handleError(err?.response?.status, router);
      }
      showNotification({
        message: err?.response?.data?.message || 'Something went wrong',
        variant: 'error',
      })
    } finally {
      queryClient.invalidateQueries(['cartList']);
    }
  }

  const steps = [
    { id: 1, title: 'Cart' },
    { id: 2, title: 'Shipping' },
    { id: 3, title: 'Payment' },
  ];

  const Stepper = ({ step, setStep }) => {
    return (
      <div className='pb-8'>
        <div className="flex justify-center px-3 sm:px-8 py-8 shadow-sm mb-6">
          {steps.map(({ id, title }, index) => (
            <div key={id} className="flex items-center">
              {/* Step Circle + Label */}
              <div
                onClick={() => setStep(id)}
                className="cursor-pointer flex flex-col items-center space-y-1"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold
                  ${step >= id ? '!bg-primary' : 'bg-red-100 !text-red-600'}
                `}
                >
                  {id === 1 && (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M6.25 6.39167V5.58333C6.25 3.70833 7.75833 1.86667 9.63333 1.69167C11.8667 1.475 13.75 3.23333 13.75 5.425V6.575" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M7.5 18.3333H12.5C15.85 18.3333 16.45 16.9917 16.625 15.3583L17.25 10.3583C17.475 8.325 16.8916 6.66667 13.3333 6.66667H6.66664C3.10831 6.66667 2.52498 8.325 2.74998 10.3583L3.37498 15.3583C3.54998 16.9917 4.14998 18.3333 7.5 18.3333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12.9129 10H12.9204" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M7.07878 10H7.08626" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}

                  {id === 2 && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C8.13401 2 5 5.13401 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13401 15.866 2 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  )}

                  {id === 3 && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M2 7C2 5.89543 2.89543 5 4 5H20C21.1046 5 22 5.89543 22 7V17C22 18.1046 21.1046 19 20 19H4C2.89543 19 2 18.1046 2 17V7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M2 10H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M6 15H6.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M10 15H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>

                <span className={`text-sm ${step === id ? ' font-semibold' : 'text-gray-500'}`}>
                  {title}
                </span>
              </div>

              {/* Connecting Line - shown between only first and second steps */}
              {index < steps.length - 1 && (
                <div
                  className={`w-10 h-0.5 mx-2 mb-2 self-end 
                  ${step > id ? 'bg-red-600' : 'bg-gray-300'}
                `}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };


  const renderCart = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-20 mb-8">
      <div className="md:col-span-2 flex flex-col gap-4">
        {Array.isArray(cartData?.cartItems) && cartData?.cartItems?.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-10">
            <p className="text-sm text-gray-500">No products in cart.</p>
            <Button onClick={() => router.push('/')} className="bg-primary text-white">
              Back to Products
            </Button>
          </div>
        ) : (
          cartData?.cartItems?.map((item) => (
            <div
              key={item?.id}
              className="flex gap-4 bg-gray-100 shadow-sm p-4 rounded-xl"
            >
              <img
                src={item?.productImage}
                alt="Product"
                className="w-25 h-25 rounded-md object-cover"
              />
              <div className="flex flex-col gap-2 flex-1 text-xs">
                <h5 className="font-medium text-base">{item?.productName}</h5>
                <div className="flex gap-2">
                  <div className="rounded-full px-2 py-0.5 bg-white">
                    Color: <span className="capitalize font-semibold">{item?.variants?.Color || "color"}</span>
                  </div>
                  <div className="rounded-full px-2 py-0.5 bg-white">
                    Size: <span className="capitalize font-semibold">{item?.variants?.Size || "size"}</span>
                  </div>
                </div>
                <p className="text-primary font-bold">
                  {formatIDRCustom(item?.price, {
                    withPrefix: true,
                    decimalPlaces: 2,
                  })}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(item?.id, item?.productId)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
                <div className="rounded-full px-2 py-0.5 bg-white flex items-center gap-2 overflow-hidden">
                  <Minus
                    size={10}
                    className={`text-black cursor-pointer ${item.quantity === 1 && 'opacity-30 cursor-not-allowed'}`}
                    onClick={() =>
                      item.quantity > 1 &&
                      handleUpdateQuantity(item.id, item.productId, item.quantity - 1)
                    }
                  />
                  <span className="text-xs">{item?.quantity}</span>
                  <Plus
                    size={10}
                    className="text-black cursor-pointer"
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.productId, item.quantity + 1)
                    }
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>


      <div className='flex md:ps-6 md:border-l  flex-col justify-between gap-4' >
        <div>


          <h4 className="text-sm font-semibold mb-2 ">Discount Code</h4>
          <div className="flex gap-2 items-center px-4 rounded-md border border-gray-600">
            <Input
              className="border-0 border-none ps-0"
              placeholder="Enter Code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
            />
            <div className="text-primary cursor-pointer font-semibold" >Apply</div>

          </div>
        </div>

        <div className="">
          <h4 className="text-sm font-bold mb-4">Price Details ({cartData?.cartItems?.length} Items)</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total MRP</span>
              <span>{formatIDRCustom(cartData?.totalPrice, {
                withPrefix: true,
                decimalPlaces: 2,
              })}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount on MRP</span>
              <span className="text-green-600">{formatIDRCustom(cartData?.disCountPrice, {
                withPrefix: true,
                decimalPlaces: 2,
              })}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="text-red-600">{formatIDRCustom(cartData?.deliveryFees, {
                withPrefix: true,
                decimalPlaces: 2,
              })}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total Amount</span>
              <span>{formatIDRCustom(cartData?.totalAmount, {
                withPrefix: true,
                decimalPlaces: 2,
              })}</span>
            </div>
          </div>
          <Button
            className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white"
            onClick={() => setStep(2)}
          >
            CHECKOUT
          </Button>
        </div>

      </div>

    </div>
  );

  const renderAddress = () => (
    <h1 className='text-4xl text-center font-bold'>Coming Soon In Next Sprint</h1>
    // <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-sm">
    //   <h2 className="text-lg font-medium mb-4">Shipping Details</h2>
    //   <div className="space-y-4">
    //     <Input placeholder="Full Name" />
    //     <Input placeholder="Mobile Number" />
    //     <Input placeholder="Pincode" />
    //     <Input placeholder="Address (Area & Street)" />
    //     <Input placeholder="City / District / Town" />
    //     <Input placeholder="State" />
    //     <div className="flex justify-between gap-4">
    //       <Button variant="outline" className="w-full" onClick={() => setStep(1)}>
    //         Back
    //       </Button>
    //       <Button className="bg-red-600 text-white hover:bg-red-700 w-full" onClick={() => setStep(3)}>
    //         Proceed to Payment
    //       </Button>
    //     </div>
    //   </div>
    // </div>
  );

  const renderPayment = () => (
    <h1 className='text-4xl text-center font-bold'>Coming Soon In Next Sprint</h1>
    // <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-sm">
    //   <h2 className="text-lg font-medium mb-4">Payment</h2>
    //   <div className="space-y-4">
    //     <Input placeholder="Card Number" />
    //     <div className="grid grid-cols-2 gap-4">
    //       <Input placeholder="Expiry Date" />
    //       <Input placeholder="CVV" />
    //     </div>
    //     <Input placeholder="Cardholder Name" />
    //     <div className="flex justify-between gap-4">
    //       <Button variant="outline" className="w-full" onClick={() => setStep(2)}>
    //         Back
    //       </Button>
    //       <Button className="bg-green-600 text-white hover:bg-green-700 w-full" onClick={() => setStep(4)}  >
    //         Pay Now
    //       </Button>
    //     </div>
    //   </div>
    // </div>
  );

  const renderSuccess = () => (
    <h1 className='text-4xl text-center font-bold'>Coming Soon In Next Sprint</h1>
    // <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-sm">
    //   <h2 className="text-lg font-medium mb-4">Order Placed Successfully</h2>
    //   <div className="space-y-4">
    //     <p className="text-sm">Your order has been placed successfully.</p>
    //     <Button className="bg-green-600 text-white hover:bg-green-700 w-full" onClick={() => setStep(1)}>
    //       Go to Home
    //     </Button>
    //   </div>
    // </div>
  );

  return (
    <div className="">
      <Stepper step={step} setStep={setStep} />
      {step === 1 && renderCart()}
      {step === 2 && renderAddress()}
      {step === 3 && renderPayment()}
      {step === 4 && renderSuccess()}
    </div>
  );
}
