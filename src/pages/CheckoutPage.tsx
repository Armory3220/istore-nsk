import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCartStore } from '../store/cartStore';

export const CheckoutPage = () => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const totalPrice = getTotalPrice();

  const [userId, setUserId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [telegram, setTelegram] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');

  const [deliveryMethod, setDeliveryMethod] = useState('Магазин на Гоголя, 1');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Картой при получении');
  const [giftWrap, setGiftWrap] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Подгружаем данные авторизованного пользователя, если он вошел
  useEffect(() => {
    const loadUserProfile = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;
      if (user) {
        setUserId(user.id);
        setEmail(user.email || '');

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ');
          if (fullName) setCustomerName(fullName);
          if (profile.phone) setPhone(profile.phone);
          if (profile.telegram) setTelegram(profile.telegram);
          if (profile.address) setAddress(profile.address);
        }
      }
    };
    loadUserProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim()) {
      setErrorMsg('Пожалуйста, заполните Имя и Телефон');
      return;
    }
    if (deliveryMethod === 'Бесплатная доставка' && !address.trim()) {
      setErrorMsg('Укажите адрес доставки по Новосибирску');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        customer_name: customerName.trim(),
        phone: phone.trim(),
        telegram: telegram.trim() || null,
        email: email.trim() || null,
        comment: comment.trim() || null,
        delivery_method: deliveryMethod,
        address: deliveryMethod === 'Бесплатная доставка' ? address.trim() : null,
        payment_method: paymentMethod,
        gift_wrap: giftWrap,
        items: items,
        total_price: totalPrice,
      })
      .select('id')
      .single();

    setSubmitting(false);

    if (error) {
      setErrorMsg('Ошибка при оформлении заказа: ' + error.message);
      return;
    }

    if (data) {
      setOrderNumber(data.id);
      clearCart();
    }
  };
  if (orderNumber !== null) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-emerald-500/15 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h1 className="text-3xl font-bold text-white">Заказ №{orderNumber} оформлен!</h1>
        <p className="text-zinc-400 mt-3 text-sm leading-relaxed">
          Спасибо за покупку в i:Store! Менеджер свяжется с вами в ближайшее время для подтверждения деталей.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/account"
            className="px-6 py-3 bg-[#222226] hover:bg-zinc-800 border border-zinc-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            Мои заказы
          </Link>
          <Link
            to="/catalog"
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            В каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 pb-20">
      <Link
        to="/cart"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Вернуться в корзину</span>
      </Link>

      <h1 className="text-3xl font-bold text-white mb-8">Оформление заказа</h1>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/40 rounded-xl text-sm text-red-400">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Левая колонка: Контактные данные */}
        <div className="bg-[#222226] border border-zinc-800/80 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white mb-2">Контактные данные</h2>

          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Имя *</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Иван Иванов"
              className="w-full bg-[#18181b] border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Телефон *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 (999) 123-45-67"
              className="w-full bg-[#18181b] border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Telegram</label>
              <input
                type="text"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                placeholder="@username"
                className="w-full bg-[#18181b] border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mail@example.ru"
                className="w-full bg-[#18181b] border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Комментарий к заказу</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Пожелания по времени доставки или переносу данных..."
              className="w-full bg-[#18181b] border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none resize-none"
            />
          </div>
        </div>

        {/* Правая колонка: Доставка и оплата */}
        <div className="bg-[#222226] border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white mb-3">Способ получения</h2>
              <div className="space-y-2.5">
                {['Магазин на Гоголя, 1', 'Магазин на пл. Маркса, 2', 'Бесплатная доставка'].map(
                  (method) => (
                    <label
                      key={method}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-sm cursor-pointer transition-colors ${
                        deliveryMethod === method
                          ? 'border-orange-500 bg-orange-500/10 text-white'
                          : 'border-zinc-800 bg-[#18181b] text-zinc-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === method}
                        onChange={() => setDeliveryMethod(method)}
                        className="accent-orange-500"
                      />
                      <span>{method}</span>
                    </label>
                  )
                )}
              </div>

              {deliveryMethod === 'Бесплатная доставка' && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Улица, дом, квартира (г. Новосибирск)"
                    className="w-full bg-[#18181b] border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-3">Способ оплаты</h2>
              <div className="space-y-2.5">
                {['Картой при получении', 'Наличные', 'Оплатить в кредит'].map((pay) => (
                  <label
                    key={pay}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-sm cursor-pointer transition-colors ${
                      paymentMethod === pay
                        ? 'border-orange-500 bg-orange-500/10 text-white'
                        : 'border-zinc-800 bg-[#18181b] text-zinc-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === pay}
                      onChange={() => setPaymentMethod(pay)}
                      className="accent-orange-500"
                    />
                    <span>{pay}</span>
                  </label>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-3 text-sm text-zinc-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={giftWrap}
                onChange={(e) => setGiftWrap(e.target.checked)}
                className="w-4 h-4 accent-orange-500 rounded"
              />
              <span>Нужна подарочная упаковка (бесплатно)</span>
            </label>
          </div>

          <div className="pt-4 border-t border-zinc-800">
            <div className="flex justify-between items-baseline mb-4">
              <span className="text-sm text-zinc-400">К оплате:</span>
              <span className="text-2xl font-bold text-white">
                {totalPrice.toLocaleString('ru-RU')} ₽
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting || items.length === 0}
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-800 text-white font-semibold rounded-xl transition-colors cursor-pointer"
            >
              {submitting ? 'Оформляем...' : 'Оформить'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
