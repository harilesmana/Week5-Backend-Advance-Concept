# Typescript
TypeScript adalah bahasa pemrograman yang dibangun di atas JavaScript. Ia menambahkan fitur typing statis pada JavaScript, yang memungkinkan pengembang untuk mendefinisikan tipe data pada variabel, fungsi, dan objek sebelum program dijalankan. TypeScript dirancang untuk membuat pengembangan aplikasi lebih aman dan terstruktur, serta mempermudah debugging dan pemeliharaan kode.

## Apa itu Typesctipt
TypeScript adalah superset dari JavaScript yang menambahkan type system (sistem tipe data) ke dalam bahasa tersebut. TypeScript dikompilasi menjadi JavaScript murni, yang berarti bahwa kode TypeScript bisa dijalankan di mana saja JavaScript bisa dijalankan, seperti di browser atau server (dengan Node.js).

## Keuntungan Menggunakan TypeScript:
- Static Typing: Memungkinkan pengembang untuk menentukan tipe data variabel dan parameter fungsi, yang membantu dalam menangkap bug lebih awal di proses pengembangan.
- Intellisense dan Autocomplete: TypeScript memberikan dukungan yang lebih baik untuk editor seperti VS Code, karena tipe data dapat digunakan untuk memberikan saran kode secara otomatis.
- OOP dan Fitur Lanjutan: Mendukung fitur-fitur Object-Oriented Programming (OOP) seperti kelas, antarmuka (interfaces), dan modul.
- Pemeliharaan Kode Lebih Mudah: Dengan tipe data yang eksplisit, proyek besar dengan tim pengembang yang banyak akan lebih mudah dipelihara dan di-debug.

# Fitur Utama TypeScript

## 1. Primitive Types:

- `number`: Semua numeric values
- `string`: Text values
- `boolean`: true/false values
- `null` and `undefined`
- `void`: Tidak ada jenisnya (biasanya di pake untuk define sebuah function)
- `any`: Dinamik typing (Hindari penggunaan ini jika bisa )
- `never`: Values yang seharusnya tidak ada

Contoh:  
```js
let age: number = 25;
let name: string = "John";
let isStudent: boolean = true;
let undifine: null = null;
let callFunction: void = () => {};
let allType: any = [age,isStudent,name,callFunction];
type NonNullable<T> = T extends null | undefined ? never : T;
```
## 2. Complex Types
Complex type biasanya terjadi pada di variable yang bisa menampung beberapa variable seperti array, tupple, object

Contoh: 
```js
// Array
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ["Alice", "Bob"];

// Tuple
let coordinate: [number, number] = [10, 20];
let userInfo: [string, number] = ["John", 30];

// Object
let user: {
    name: string;
    age: number;
    email?: string;  // Optional property
} = {
    name: "John",
    age: 30
};
```

##   3. Interfaces dan Alias
Interface: Digunakan untuk mendefinisikan struktur objek dan kontrak yang harus diikuti oleh suatu objek. Interface dapat digunakan untuk mendeklarasikan kelas dan objek, serta dapat digunakan untuk mendefinisikan tipe fungsi.

Type Alias: Digunakan untuk memberikan nama baru untuk tipe yang ada (alias). Tipe ini bisa berupa primitive types, tuples, union types, intersection types, objek, dan bahkan fungsi.

Contoh: 
```js
// define type pada interface
interface Orang {
  nama: string;
  usia: number;
}

let orang: Orang = {
  nama: "Jane",
  usia: 28
};

// define type pada alias
type Produk = {
  nama: string;
  harga: number;
}

let produk: Produk = {
  nama: "Laptop",
  harga: 15000000
};
```

## 4. Functions
Penggunaan typescript pada function dilakukan pada saat mendifine variable pada parameter yang akan masuk ke dalam function

Contoh: 
```js
// Function type definition
type MathOperation = (a: number, b: number) => number;

// Function implementation
const add: MathOperation = (a, b) => a + b;

// Function with optional and default parameters
function greet(name: string, greeting: string = "Hello"): string {
    return `${greeting}, ${name}!`;
}

```

## 5. Generics
Generics memungkinkan kalian untuk membuat fungsi atau kelas yang dapat bekerja dengan tipe data yang berbeda secara fleksibel tanpa mengorbankan keamanan tipe.

Contoh: 
```js
// Generic function
function identity<T>(arg: T): T {
    return arg;
}

// Generic interface
interface Container<T> {
    value: T;
    getValue(): T;
}

// Generic class
class Box<T> {
    constructor(private content: T) {}
    getContent(): T {
        return this.content;
    }
}

```

## 6. Advanced Types
Berikut adalah tehnik2 Advance type pada typescript seperti Union Type, Intersection Type, dan Type Guards
```js
// Union Type
type Employee = Person & Workable;

// Intersection Type
type Employee = Person & Workable;

// Type Guards
function isString(value: unknown): value is string {
  return typeof value === "string";
}
```

## 7. Decorators


```js
function Component(constructor: Function) {
  console.log(`Class ${constructor.name} telah didekorasi`);
}

@Component
class MyComponent {
  constructor() {
    console.log('MyComponent instance created');
  }
}

// Output:
// Class MyComponent telah didekorasi
// MyComponent instance created
```

# Best Practices
hal - hal yang baik dan benar pada saat menggunakan typescript:
- Menyalakan Strict mode di tsconfig.json
- hindari pneggunaan `Any`
- gunakan interface pada variable berbentuk Object
- gunakan union types dari pada menggunakan enums
- menulis documentasi code sendiri
- penulisan nama variable yang cocok