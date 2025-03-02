import { useEffect, useState } from "react";

// Bu bileşen todo listesi oluşturur ve API'den alınan verileri görüntüler.
// Görevler:
// 1. useEffect hook'u kullanarak `https://jsonplaceholder.typicode.com/users/1/todos` API'sinden verileri alın ve bu verileri state içinde saklayın.
// 2. Alınan verileri Todo bileşenine props olarak aktararak her bir todo öğesini liste halinde görüntüleyin.
// 3. Her todo için şu bilgileri gösterin:
//    - Başlık (title)
//    - Tamamlanma durumu (completed, checkbox olarak gösterilmeli)
// 4. Checkbox işaretlendiğinde veya kaldırıldığında, o todo'nun tamamlanma durumunu state'de güncelleyin (UI'da hemen güncellenmeli).

// Bonus:
// - "Yapılacaklar Listem" başlığının altına, toplam todo sayısını ve tamamlanmış olan todo sayısını gösterin (örneğin, "Toplam: 10, Tamamlanmış: 3").
// - Todo listesini alfabetik sıraya veya tamamlanma durumuna göre sıralamak için bir dropdown ekleyin.
// - Kullanıcı listeye yeni bir todo ekleyebilsin. Yeni eklenen todo, otomatik olarak "tamamlanmamış" durumunda ve geçici ID ile eklenmelidir.
// - API'den veri alınırken yükleniyor durumu (Loading...) ve hata durumu (Hata oluştu.) ekleyin.

// Tailwind ile ilgili istekler:
// 1. Todo öğeleri için daha belirgin kart tasarımı oluşturun (örneğin, shadow, border, ve rounded-md class'larını kullanarak).
// 2. Tamamlanmış todo öğelerinin başlıklarına vurgu ekleyin (örneğin, line-through ve text-gray-500).
// 3. "Yapılacaklar Listem" başlığını ve sayaçları farklı bir arka plan ve yazı stiliyle vurgulayın.
// 4. Checkbox hover edildiğinde, kutunun kenar rengini değiştiren bir animasyon ekleyin.
// 5. Mobil cihazlar için listeyi daha kompakt bir düzene göre optimize edin (örneğin, küçük yazı tipi boyutları ve dar kenar boşlukları).

export default function Todos() {
  const [todos, setTodos] = useState([]); // API'den gelen todo'lar
  const [loading, setLoading] = useState(true); // Yüklenme durumu
  const [error, setError] = useState(null); // Hata durumu
  const [sortType, setSortType] = useState("default"); // Sıralama türü

  // API'den veri çekme
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users/1/todos")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Veri alınırken hata oluştu!"); // Hata fırlatma
        }
        return res.json();
      })
      .then((data) => {
        setTodos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message); // Hata mesajını state'e kaydet
        setLoading(false);
      });
  }, []);

  // Checkbox değiştiğinde todo'yu güncelle
  const toggleTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Sıralama fonksiyonu
  const sortedTodos = [...todos].sort((a, b) => {
    if (sortType === "alphabetical") return a.title.localeCompare(b.title);
    if (sortType === "completed") return a.completed - b.completed;
    return 0; // Varsayılan sıra
  });

  return (
    <div className="flex flex-col items-center py-8">
      <h1 className="text-2xl font-bold pb-4 bg-blue-100 p-2 rounded-md">
        Yapılacaklar Listem
      </h1>

      {/* Hata ve Yükleme Durumu */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Sayaç */}
      <p>
        Toplam: {todos.length}, Tamamlanmış:{" "}
        {todos.filter((todo) => todo.completed).length}
      </p>

      {/* Sıralama Seçeneği */}
      <select
        onChange={(e) => setSortType(e.target.value)}
        className="mt-2 p-2 border rounded-md"
      >
        <option value="default">Varsayılan</option>
        <option value="alphabetical">Alfabetik</option>
        <option value="completed">Tamamlanma Durumu</option>
      </select>

      {/* Todo Listesi */}
      <div className="space-y-3 w-80 mt-4">
        {sortedTodos.map((todo) => (
          <Todo key={todo.id} todo={todo} toggleTodo={toggleTodo} />
        ))}
      </div>
    </div>
  );
}

// Todo Bileşeni
function Todo({ todo, toggleTodo }) {
  return (
    <div className="flex items-center bg-white shadow-md p-3 rounded-md">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
      />
      <span
        className={`ml-3 ${
          todo.completed ? "line-through text-gray-500" : "text-black"
        }`}
      >
        {todo.title}
      </span>
    </div>
  );
}
