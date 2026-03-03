// frontend/src/App.tsx
import { Routes, Route, Link } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import PayerForm from '@/components/PayerForm';
import Vedomost from '@/components/Vedomost';
import InvoiceForm from '@/components/InvoiceForm';

// ЗАГОТОВКИ ДЛЯ БУДУЩИХ UI
import DeviationCard from '@/components/stubs/DeviationCard';
    import DeviationRegistry from '@/components/stubs/DeviationRegistry';
import OrderToCounterparty from '@/components/stubs/OrderToCounterparty';
import OrdersRegistry from '@/components/stubs/OrdersRegistry';
import InvoicesRegistry from '@/components/stubs/InvoicesRegistry';
import Memo from '@/components/stubs/Memo';
import MemosRegistry from '@/components/stubs/MemosRegistry';

function App() {
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 overflow-auto p-8">
                <Routes>
                    <Route path="/" element={<Vedomost />} />
                    <Route path="/payer" element={<PayerForm />} />
                    <Route path="/invoice" element={<InvoiceForm />} />

                    {/* ЗАГОТОВКИ */}
                    <Route path="/deviation-card" element={<DeviationCard />} />
                    <Route path="/deviation-registry" element={<DeviationRegistry />} />
                    <Route path="/order-counterparty" element={<OrderToCounterparty />} />
                    <Route path="/orders-registry" element={<OrdersRegistry />} />
                    <Route path="/invoices-registry" element={<InvoicesRegistry />} />
                    <Route path="/memo" element={<Memo />} />
                    <Route path="/memos-registry" element={<MemosRegistry />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;