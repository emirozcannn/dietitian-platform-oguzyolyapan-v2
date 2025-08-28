# PayTR Ödeme Entegrasyonu Kurulumu

## 1. PayTR Hesabı Oluşturma

1. [PayTR](https://www.paytr.com) sitesine gidip hesap oluşturun
2. Gerekli belgeleri yükleyip onay alın
3. Merchant ID, Merchant Key ve Merchant Salt bilgilerini alın

## 2. Environment Variables Ayarları

`.env` dosyasına aşağıdaki bilgileri ekleyin:

```env
# PayTR Configuration
VITE_PAYTR_MERCHANT_ID=your_merchant_id
VITE_PAYTR_MERCHANT_KEY=your_merchant_key
VITE_PAYTR_MERCHANT_SALT=your_merchant_salt
VITE_PAYTR_TEST_MODE=true
```

## 3. Callback URL'leri Ayarlama

PayTR panelinde aşağıdaki callback URL'leri ayarlayın:

- **Başarılı Ödeme URL:** `https://yourdomain.com/payment-success`
- **Başarısız Ödeme URL:** `https://yourdomain.com/payment-failed`
- **Bildirim URL:** `https://yourdomain.com/payment-callback`

## 4. Test Kartları

PayTR test ortamında kullanabileceğiniz test kartları:

### Başarılı İşlem
- **Kart No:** 4355 0843 5508 4358
- **Son Kullanma:** 12/26
- **CVV:** 000

### Yetersiz Bakiye
- **Kart No:** 4355 0843 5508 4325
- **Son Kullanma:** 12/26
- **CVV:** 000

### Geçersiz Kart
- **Kart No:** 4355 0843 5508 4333
- **Son Kullanma:** 12/26
- **CVV:** 000

## 5. Güvenlik Ayarları

1. **IP Kısıtlaması:** PayTR panelinde sunucu IP adresinizi tanımlayın
2. **Hash Doğrulama:** Tüm callback'lerde hash doğrulaması yapılıyor
3. **SSL:** Sadece HTTPS üzerinden işlem yapın

## 6. Entegrasyonun Çalışması

### 6.1 Ödeme Akışı

1. Kullanıcı checkout sayfasında bilgilerini girer
2. `createPayTRPayment` fonksiyonu çağrılır
3. PayTR'den token alınır
4. Kullanıcı PayTR ödeme sayfasına yönlendirilir
5. Ödeme tamamlandıktan sonra callback URL'sine yönlendirilir
6. `verifyPayTRCallback` fonksiyonu ile doğrulama yapılır
7. Sipariş durumu güncellenir
8. Kullanıcıya bildirim gönderilir

### 6.2 Kullanılan Fonksiyonlar

```javascript
// Ödeme oluşturma
const result = await createPayTRPayment(orderData, userData);

// Callback doğrulama
const verification = await verifyPayTRCallback(callbackData);

// Ödeme durumu sorgulama
const status = await checkPaymentStatus(orderNumber);
```

## 7. Veritabanı Tabloları

Gerekli tablolar `database/project.sql` dosyasında mevcut:

- `orders` - Sipariş bilgileri
- `order_items` - Sipariş öğeleri
- `order_status_history` - Sipariş durum geçmişi

## 8. Hata Ayıklama

### 8.1 Yaygın Hatalar

1. **"Invalid Hash"** - Merchant key/salt yanlış
2. **"IP Not Allowed"** - IP kısıtlaması aktif
3. **"Invalid Amount"** - Tutar kuruş cinsinden gönderilmeli
4. **"Invalid Basket"** - Sepet formatı yanlış

### 8.2 Log Kontrolü

```javascript
// Console'da PayTR request logları
console.log('PayTR Request Data:', paymentData);

// Hata durumunda detaylı log
console.error('PayTR Error:', error);
```

## 9. Canlı Ortam Ayarları

Canlı ortama geçmek için:

1. PayTR hesabınızı canlı ortam için onaylayın
2. `.env` dosyasında `VITE_PAYTR_TEST_MODE=false` yapın
3. Callback URL'lerini canlı domain ile güncelleyin
4. SSL sertifikasının geçerli olduğundan emin olun

## 10. Taksit Seçenekleri

```javascript
// Taksit seçeneklerini alma
const installments = await getInstallmentOptions(binNumber, amount);
```

## 11. Destek

- PayTR Destek: support@paytr.com
- Teknik Dokümantasyon: [PayTR API Docs](https://dev.paytr.com)
- Test Ortamı: [PayTR Test](https://test.paytr.com)

## 12. Önemli Notlar

- Tüm tutarlar kuruş cinsinden gönderilmeli (100 = 1 TL)
- Hash hesaplaması PayTR dokümantasyonuna uygun yapılmalı
- Callback'lerde güvenlik için hash doğrulaması yapılmalı
- Test ortamında gerçek para işlemi yapılmaz
- Canlı ortamda işlem limitleri ve komisyon oranları geçerlidir