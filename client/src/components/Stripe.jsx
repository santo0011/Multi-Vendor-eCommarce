import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import CheckoutForm from './CheckoutForm';
import api from '../api/api';


const stripePromise = loadStripe('pk_test_51NolxnKPP1hRVgwQoaYl9sDnFMWxS9hdjklaheiRZF60e0QTD8jMPCLeBIf2vtwjNAvFS58N8UTr31c2oqroAMVo00oT2yyqxY')

const Stripe = ({ price, orderId }) => {
  const [clientSecret, setClientSecret] = useState('')

  const apperance = {
    theme: 'stripe'
  }
  const options = {
    apperance,
    clientSecret
  }

  // create_payment
  const create_payment = async () => {
    try {
      const { data } = await api.post('/home/order/create-payment', { price }, { withCredentials: true });
      setClientSecret(data.clientSecret)
    } catch (error) {
      console.log(error.response.data)
    }
  }

  return (
    <div className='mt-4'>
      {
        clientSecret ? (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm orderId={orderId} />
          </Elements>
        ) : <button onClick={create_payment} className='px-10 py-[6px] rounded-sm hover:shadow-orange-500/20 hover:shadow-lg bg-orange-500 text-white'>Start Payment</button>
      }
    </div>
  )
}

export default Stripe;