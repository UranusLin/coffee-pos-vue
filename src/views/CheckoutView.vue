<script setup>
import { ref, computed } from 'vue'
import { useCheckoutStore } from '@/stores/checkout'
import { useTransactionsStore } from '@/stores/transactions'
import { useInventoryStore } from '@/stores/inventory'
import CustomizeModal from '@/components/CustomizeModal.vue'
import { useToast } from '@/components/ui/toast/use-toast'

const checkoutStore = useCheckoutStore()
const transactionsStore = useTransactionsStore()
const inventoryStore = useInventoryStore()
const { toast } = useToast()

const menuItems = ref([
  {
    id: 1,
    code: 'espresso',
    name: '濃縮咖啡(Espresso)',
    basePrice: 80,
    sizes: ['小', '中', '大'],
    temperatures: ['熱', '冰'],
    sugarLevels: ['無糖', '微糖', '半糖', '正常'],
    iceLevels: ['去冰', '微冰', '少冰', '正常冰']
  },
  {
    id: 2,
    code: 'americano',
    name: '美式咖啡(Americano)',
    basePrice: 100,
    sizes: ['小', '中', '大'],
    temperatures: ['熱', '冰'],
    sugarLevels: ['無糖', '微糖', '半糖', '正常'],
    iceLevels: ['去冰', '微冰', '少冰', '正常冰']
  },
  {
    id: 3,
    code: 'latte',
    name: '拿鐵(Latte)',
    basePrice: 120,
    sizes: ['小', '中', '大'],
    temperatures: ['熱', '冰'],
    sugarLevels: ['無糖', '微糖', '半糖', '正常'],
    iceLevels: ['去冰', '微冰', '少冰', '正常冰']
  },
  {
    id: 4,
    code: 'cappuccino',
    name: '卡布奇諾(Cappuccino)',
    basePrice: 130,
    sizes: ['小', '中', '大'],
    temperatures: ['熱', '冰'],
    sugarLevels: ['無糖', '微糖', '半糖', '正常'],
    iceLevels: ['去冰', '微冰', '少冰', '正常冰']
  }
])

const currentOrder = ref([])
const showCustomizeModal = ref(false)
const selectedItem = ref(null)

const orderTotal = computed(() => {
  return currentOrder.value.reduce((total, item) => total + calculateItemPrice(item), 0)
})

function openCustomizeModal(item) {
  selectedItem.value = item
  console.log('origin order: ', item)
  showCustomizeModal.value = true
}

function closeCustomizeModal() {
  showCustomizeModal.value = false
}

function addToOrder(item) {
  console.log('after order: ', item)
  currentOrder.value.push(item)
  toast({ title: 'Order update', description: `${item.name} add to Oder` })
}

function removeFromOrder(index) {
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
    alert('empty order list')
    return
  }
  for (const item of currentOrder.value) {
    if (!inventoryStore.checkStock(item.code)) {
      alert(`Not enough ingredients for ${item.name}. Please restock.`)
      return
    }
  }
  for (const item of currentOrder.value) {
    inventoryStore.consumeIngredients(item.code)
  }

  const transaction = {
    // TODO: this will be issue when multi user create
    id: Date.now(),
    items: currentOrder.value,
    total: orderTotal.value,
    date: new Date().toISOString()
  }
  checkoutStore.completeOrder(transaction)
  transactionsStore.addTransaction(transaction)
  currentOrder.value = []
  // alert('Order completed!')
  toast({
    title: 'Order status update.',
    description: 'Order completed!',
    variant: 'destructive'
  })
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold mb-4">Checkout</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h2 class="text-xl font-semibold mb-2">Menu Items</h2>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="item in menuItems"
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
            </span>
            <button @click="removeFromOrder(index)" class="text-red-500 hover:text-red-700">
              Remove
            </button>
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
        </div>
      </div>
    </div>
    <CustomizeModal
      v-if="showCustomizeModal"
      :item="selectedItem"
      @add="addToOrder"
      @close="closeCustomizeModal"
    />
  </div>
</template>
