<template>
  <div class="upgrade-modal">
    <h3>Upgrade Your Plan</h3>
    
    <div class="plans-grid">
      <!-- Starter Plan -->
      <div class="plan-card" :class="{ 'popular': plan.popular }" v-for="plan in plans" :key="plan.id">
        <div class="plan-header">
          <h4>{{ plan.name }}</h4>
          <div class="price">${{ plan.price }}/month</div>
        </div>
        
        <ul class="features">
          <li v-for="feature in plan.features" :key="feature">
            <Icon icon="material-symbols:check" class="text-green-500" />
            {{ feature }}
          </li>
        </ul>
        
        <button 
          @click="upgradeTo(plan.id)"
          class="btn-primary w-full"
        >
          Upgrade Now
        </button>
      </div>
    </div>
    
    <!-- Crypto Payment Option -->
    <div class="crypto-payment">
      <h4>Pay with Crypto</h4>
      <button @click="payWithCrypto" class="btn-secondary">
        <Icon icon="material-symbols:currency-bitcoin" />
        Pay with Crypto
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 5.99,
    popular: false,
    features: [
      '250 contracts/month',
      'PDF export with footer watermark',
      'Google Drive & OneDrive integration'
    ]
  },
  {
    id: 'agent', 
    name: 'Agent',
    price: 10.99,
    popular: true,
    features: [
      '1000 contracts/month',
      'Contribution system access',
      'CRM integrations',
      'Light watermark'
    ]
  },
  {
    id: 'industrial',
    name: 'Industrial',
    price: 25.99,
    popular: false,
    features: [
      'Unlimited contracts',
      'No watermark',
      'Free advertising when contributing',
      'All integrations'
    ]
  }
]

const upgradeTo = async (planId: string) => {
  // Generate payment link or show crypto address
  const paymentData = await generatePaymentLink(planId)
  
  if (paymentData.crypto) {
    showCryptoAddress(paymentData.address, paymentData.amount)
  } else {
    window.open(paymentData.url, '_blank')
  }
}

const payWithCrypto = () => {
  // Show crypto payment modal with addresses
  showCryptoModal()
}
</script>