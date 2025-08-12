import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Mesas from "./pages/Mesas";
import ComandasList from "./pages/ComandasList";
import Nova from "./pages/Nova";
import Admin from "./pages/Admin";
import ComandaDetalhe from "./pages/ComandaDetalhe";
import QRCode from "./pages/QRCode";
import Pedir from "./pages/Pedir";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Mesas />} />
          <Route path="/mesas" element={<Mesas />} />
          <Route path="/comandas" element={<ComandasList />} />
          <Route path="/nova" element={<Nova />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/comanda/:id" element={<ComandaDetalhe />} />
          <Route path="/qrcode" element={<QRCode />} />
          <Route path="/pedir/:mesaNumero" element={<Pedir />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
