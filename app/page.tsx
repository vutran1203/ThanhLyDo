"use client";
import { useState } from 'react';
import { items } from '../data/items';

// Cập nhật interface thêm trường category
interface Item {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string; 
}

export default function Home() {
  const messengerUsername = "vu.tran.396524"; 

  const [cart, setCart] = useState<Item[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // State quản lý danh mục đang chọn (Mặc định là "Tất cả")
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");

  // Tự động trích xuất các danh mục từ data (không bị trùng lặp)
  const categories = ["Tất cả", ...Array.from(new Set(items.map(item => item.category)))];

  // Lọc sản phẩm dựa trên danh mục đang chọn
  const filteredItems = selectedCategory === "Tất cả" 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const addToCart = (item: Item) => {
    if (!cart.find(i => i.id === item.id)) {
      setCart([...cart, item]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const itemList = cart.map((item, index) => `${index + 1}. ${item.name} (${formatPrice(item.price)})`).join('\n');
    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
    
    const message = `Chào bạn, mình muốn chốt các món thanh lý sau:\n${itemList}\n\nTổng cộng: ${formatPrice(totalPrice)}`;

    navigator.clipboard.writeText(message).then(() => {
      alert("Đã copy danh sách đồ! Mình sẽ mở Messenger, bạn chỉ cần bấm 'Dán' (Paste) vào khung chat nhé.");
      window.open(`https://m.me/${messengerUsername}`, '_blank');
    }).catch(() => {
      alert("Có lỗi khi copy, nhưng bạn vẫn có thể nhắn tin cho mình nhé.");
      window.open(`https://m.me/${messengerUsername}`, '_blank');
    });
  };

  const totalCartPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <main className="min-h-screen bg-gray-100 pb-24 relative">
      <header className="sticky top-0 z-10 bg-white shadow-sm flex flex-col">
        {/* Phần Header Tiêu đề */}
        <div className="px-4 py-3 flex items-center justify-center border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-800">Góc Thanh Lý Đồ Cũ</h1>
        </div>

        {/* Thanh lọc danh mục (Vuốt ngang trên Mobile) */}
        <div className="w-full overflow-x-auto bg-white hide-scrollbar">
          <div className="flex gap-2 p-3 min-w-max">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  selectedCategory === category 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </header>
      
      <div className="p-3">
        {/* Hiển thị số lượng tìm thấy */}
        <p className="text-sm text-gray-500 mb-3 px-1">
          Đang hiển thị {filteredItems.length} món
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {/* Lặp qua mảng filteredItems thay vì items gốc */}
          {filteredItems.map((item: Item) => {
            const inCart = cart.some(i => i.id === item.id);
            return (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                <div className="aspect-square bg-gray-50 relative">
                  <img src={item.image} alt={item.name} className="object-cover w-full h-full absolute inset-0" />
                  {/* Badge Category nhỏ góc trái ảnh */}
                  <span className="absolute top-2 left-2 bg-white/90 text-gray-700 text-[10px] font-bold px-2 py-1 rounded-sm shadow-sm backdrop-blur-sm">
                    {item.category}
                  </span>
                </div>
                <div className="p-2 flex flex-col flex-grow">
                  <h2 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[40px]">{item.name}</h2>
                  <p className="text-red-500 font-bold mt-1 text-sm">{formatPrice(item.price)}</p>
                  <div className="mt-auto pt-3">
                    <button 
                      onClick={() => addToCart(item)}
                      disabled={inCart}
                      className={`w-full text-center text-xs font-semibold py-2 rounded-md transition-colors ${
                        inCart ? 'bg-gray-200 text-gray-500' : 'bg-blue-600 text-white active:bg-blue-700'
                      }`}
                    >
                      {inCart ? 'Đã thêm' : 'Thêm vào giỏ'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {cart.length > 0 && (
        <button 
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 bg-red-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center z-40 hover:bg-red-600 active:scale-95 transition-transform"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-900 font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
            {cart.length}
          </span>
        </button>
      )}

      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col justify-end sm:justify-center sm:p-4">
          <div className="bg-white w-full sm:w-96 max-h-[80vh] sm:rounded-2xl rounded-t-2xl flex flex-col overflow-hidden animate-slide-up">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800">Giỏ hàng của bạn</h3>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-500 font-bold text-xl px-2">&times;</button>
            </div>
            
            <div className="overflow-y-auto p-4 flex-grow">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 my-10">Chưa có món nào</p>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between border-b border-gray-50 pb-2">
                      <div className="flex-1 pr-2">
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</p>
                        <p className="text-sm text-red-500 font-semibold">{formatPrice(item.price)}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 text-xs font-semibold px-2 py-1 bg-red-50 rounded-md"
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium text-gray-600">Tổng cộng:</span>
                <span className="font-bold text-lg text-red-600">{formatPrice(totalCartPrice)}</span>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl disabled:bg-gray-300 active:bg-blue-700 transition-colors"
              >
                Gửi qua Messenger
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}