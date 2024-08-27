<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCheckoutStore } from '@/stores/checkout'
import { useTransactionsStore } from '@/stores/transactions'
import { useInventoryStore } from '@/stores/inventory'
import CustomizeModal from '@/components/CustomizeModal.vue'
import PaymentModal from '@/components/PaymentModal.vue'
import PaymentMethodModal from '@/components/PaymentMethodModal.vue'
import { useToast } from '@/components/ui/toast/use-toast'

const checkoutStore = useCheckoutStore()
const transactionsStore = useTransactionsStore()
const inventoryStore = useInventoryStore()
const { toast } = useToast()
const errorMsg = ref('')

const menuCategories = ref(['coffee', 'non-coffee', 'food'])
const currentCategory = ref('coffee')

onMounted(() => {
  inventoryStore.fetchMenu()
  inventoryStore.fetchRecipes()
})

const currentOrder = ref([])
const showCustomizeModal = ref(false)
const showPaymentMethodModal = ref(false)
const showPaymentModal = ref(false)
const selectedItem = ref(null)
const selectExistingItem = ref(null)

const orderTotal = computed(() => {
  return currentOrder.value.reduce(
    (total, item) => total + calculateItemPrice(item) * item.quantity,
    0
  )
})

function openCustomizeModal(item, existingItem = null) {
  selectedItem.value = item
  selectExistingItem.value = existingItem
  showCustomizeModal.value = true
}

function closeCustomizeModal() {
  showCustomizeModal.value = false
}

function addToOrder(item) {
  const existimgItemIndex = currentOrder.value.findIndex(
    (orderItem) =>
      orderItem.id === item.id &&
      orderItem.customization.size === item.customization.size &&
      orderItem.customization.temperature === item.customization.temperature &&
      orderItem.customization.sugarLevel === item.customization.sugarLevel &&
      orderItem.customization.iceLevel === item.customization.iceLevel
  )

  if (existimgItemIndex !== -1) {
    if (item.quantity === 0) {
      currentOrder.value.splice(existimgItemIndex, 1)
    } else {
      currentOrder.value[existimgItemIndex] = item
    }
  } else {
    currentOrder.value.push(item)
  }

  console.log('after order: ', item)
  toast({ title: 'Order update', description: `${item.name} add to Oder` })
}

function removeFromOrder(index) {
  errorMsg.value = ''
  currentOrder.value.splice(index, 1)
}

function calculateItemPrice(item) {
  let price = item.basePrice
  if (item.customization.size === '中') price += 20
  if (item.customization.size === '大') price += 40
  return price
}

function completeOrder() {
  if (currentOrder.value.length === 0) {
    toast({
      title: 'Order Error',
      description: 'Order list is empty',
      variant: 'destructive'
    })
    return
  }

  const stockCheck = inventoryStore.checkTotalStock(currentOrder.value)
  if (!stockCheck.success) {
    errorMsg.value = `Not enough ${stockCheck.ingredient}. Please restock.`
    toast({
      title: 'Inventory Error',
      description: `Not enough ${stockCheck.ingredient}. Please restock.`,
      variant: 'destructive'
    })
    return
  }

  showPaymentMethodModal.value = true
}

function selectPaymentMethod(method) {
  showPaymentMethodModal.value = false
  if (method === 'cash') {
    showPaymentModal.value = true
  } else {
    finalizePayment({ paymentMethod: method, amountPaid: orderTotal.value, change: 0 })
  }
}

const filteredMenuItems = computed(() => {
  return inventoryStore.menuItems.filter((item) => item.catrgory === currentCategory.value)
})

function cahngeCategory(category) {
  currentCategory.value = category
}

function finalizePayment(paymentDetails) {
  inventoryStore.consumeTotalIngredients(currentOrder.value)
  const transaction = {
    id: Date.now(),
    items: currentOrder.value.map((item) => ({
      ...item,
      price: calculateItemPrice(item)
    })),
    total: orderTotal.value,
    paymentMethod: paymentDetails.paymentMethod,
    amountPaid: paymentDetails.amountPaid,
    change: paymentDetails.change,
    date: new Date().toISOString()
  }
  checkoutStore.completeOrder(transaction)
  transactionsStore.addTransaction(transaction)
  currentOrder.value = []
  showPaymentModal.value = false
  toast({
    title: 'Order status update.',
    description: 'Order completed!',
    variant: 'destructive'
  })
}
function increaseQuantity(item) {
  const existingItem = currentOrder.value.find(
    (orderItem) =>
      orderItem.id === item.id &&
      orderItem.customization.size === item.customization.size &&
      orderItem.customization.temperature === item.customization.temperature &&
      orderItem.customization.sugarLevel === item.customization.sugarLevel &&
      orderItem.customization.iceLevel === item.customization.iceLevel
  )

  openCustomizeModal(item, existingItem)
}

function decreaseQuantity(item) {
  item.quantity--
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold mb-4">Checkout</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div class="mb-4">
          <nav class="flex space-x-4">
            <button
              v-for="category in menuCategories"
              :key="category"
              @click="cahngeCategory(category)"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium',
                currentCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
            >
              {{ category }}
            </button>
          </nav>
        </div>
        <h2 class="text-xl font-semibold mb-2">Menu Items</h2>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="item in filteredMenuItems"
            :key="item.id"
            @click="openCustomizeModal(item)"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {{ item.name }} - ${{ item.basePrice }}
          </button>
        </div>
      </div>
      <div>
        <h2 class="text-xl font-semibold mb-2">Current Order</h2>
        <ul class="space-y-2">
          <li
            v-for="(item, index) in currentOrder"
            :key="index"
            class="flex justify-between items-center"
          >
            <span>
              {{ item.name }} ({{ item.customization.size }}, {{ item.customization.temperature }},
              {{ item.customization.sugarLevel }}, {{ item.customization.iceLevel }}) - ${{
                calculateItemPrice(item)
              }}
              x {{ item.quantity }}
            </span>
            <div class="flex items-center">
              <button @click="decreaseQuantity(item)" class="text-red-500 hover:text-red-700 px-2">
                -
              </button>
              <span class="mx-2">{{ item.quantity }}</span>
              <button
                @click="increaseQuantity(item)"
                class="text-green-500 hover:text-green-700 px-2"
              >
                +
              </button>
              <button @click="removeFromOrder(index)" class="text-red-500 hover:text-red-700 ml-2">
                Remove
              </button>
            </div>
          </li>
        </ul>
        <div class="mt-4">
          <p class="text-xl font-semibold">Total: ${{ orderTotal }}</p>
          <button
            @click="completeOrder"
            :class="[
              'mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded',
              currentOrder.length > 0 ? '' : 'cursor-not-allowed opacity-50'
            ]"
            :disabled="currentOrder.length === 0"
          >
            Complete Order
          </button>
          <div class="text-bold text-start text-red-500">{{ errorMsg }}</div>
        </div>
      </div>
    </div>
    <CustomizeModal
      v-if="showCustomizeModal"
      :item="selectedItem"
      :existItem="selectExistingItem"
      @add="addToOrder"
      @close="closeCustomizeModal"
    />
    <PaymentMethodModal
      v-if="showPaymentMethodModal"
      :total="orderTotal"
      @selectMethod="selectPaymentMethod"
      @close="showPaymentMethodModal = false"
    />
    <PaymentModal
      v-if="showPaymentModal"
      :total="orderTotal"
      @confirm="finalizePayment"
      @close="showPaymentModal = false"
    />
  </div>
</template>
