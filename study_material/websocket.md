# Websocket
## 1. Apa itu Websocket

WebSocket adalah protokol komunikasi dua arah yang memungkinkan pertukaran data secara real-time antara server dan klien melalui koneksi TCP yang persisten. WebSocket memungkinkan komunikasi lebih efisien dibandingkan dengan HTTP karena koneksi terbuka dan tetap terjaga sepanjang sesi komunikasi.

**Fitur Utama WebSocket**:
- `Koneksi Persisten`: Setelah koneksi WebSocket dibuka, ia tetap terbuka untuk pertukaran data, sehingga mengurangi overhead yang terjadi pada setiap permintaan HTTP.
- `Komunikasi Dua Arah`: Baik klien maupun server bisa mengirimkan pesan ke pihak lainnya tanpa harus menunggu permintaan dari pihak lain.
- `Efisiensi`: Mengurangi latensi karena tidak perlu membuat permintaan HTTP berulang kali.
- `Real-Time`: Ideal untuk aplikasi yang membutuhkan data yang selalu diperbarui secara real-time (misalnya chat, game online, monitoring data).

## 2. Cara Kerja WebSocket

1. Handshake (Proses Pembukaan Koneksi) WebSocket dimulai dengan permintaan HTTP biasa (handshake) untuk meminta pembukaan koneksi WebSocket.

Contoh Handshake:
```
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
```

Jika server mendukung WebSocket, ia akan merespons dengan:

```
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: x3JJHMbDL1EzLkh9tH9J1GoYf6YbERqYZyI79g4Fj60=
```

2. **Data Transfer** Setelah handshake berhasil, koneksi WebSocket terbuka, dan data bisa dikirim dalam bentuk frame (potongan kecil dari pesan). Data bisa berupa teks, gambar, atau data biner (seperti gambar atau file audio/video).

3. **Penutupan Koneksi** Koneksi WebSocket bisa ditutup oleh salah satu pihak (klien atau server) menggunakan frame penutupan. Proses penutupan juga dilakukan dengan pesan yang lebih ringan, dibandingkan dengan HTTP yang biasanya memerlukan permintaan dan respons terpisah.


## 3. WebSocket vs HTTP

**HTTP**:

- `Satu Arah`: Klien mengirim permintaan, dan server memberikan respons.
- `Stateless`: Setiap permintaan adalah transaksi terpisah. Server tidak menyimpan status dari satu permintaan ke permintaan lainnya.
- `Overhead`: Setiap permintaan membutuhkan header HTTP yang lengkap, yang bisa menambah overhead.


**WebSocket**:

- `Dua Arah`: Keduanya (klien dan server) dapat mengirim data kapan saja.
- `Koneksi Persisten`: Koneksi tetap terbuka untuk komunikasi dua arah sepanjang waktu.
- `Efisiensi`: Pengiriman data lebih efisien karena tidak perlu membuat koneksi baru setiap kali berkomunikasi.

## 4. Keamanan WebSocket
WebSocket menggunakan protokol wss:// (seperti HTTPS) untuk mengenkripsi komunikasi dan memastikan data yang dikirimkan aman. Ini mengurangi risiko serangan seperti man-in-the-middle.

Beberapa hal yang perlu diperhatikan terkait keamanan:

- **Penggunaan WSS**: Selalu gunakan WebSocket dengan wss:// untuk mengenkripsi koneksi.
- **Autentikasi**: Pastikan klien terautentikasi dengan benar sebelum membuka koneksi WebSocket.
- **Rate Limiting**: Batasi jumlah koneksi WebSocket yang dapat dibuat dari satu alamat IP untuk mencegah serangan DoS.
- **Validasi Pesan**: Pastikan pesan yang diterima valid dan tidak menyebabkan eksekusi kode berbahaya.

## 5. WebSocket Library dan Framework

1. ws (Node.js WebSocket Library)

- instalasi
```
npm install ws
```

- penggunaan
```js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log('Pesan diterima: ' + message);
  });
});
```

2. Socket.io
Socket.io adalah library JavaScript yang memberikan WebSocket dan fallback untuk komunikasi real-time di Node.js.

- instalasi
```
npm install socket.io
```

- Penggunaan Server
```js
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('User connected');
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});
```

- Penggunaan Klien: 
```js
const socket = io();
socket.emit('chat message', 'Hello World');
socket.on('chat message', (msg) => {
  console.log(msg);
});
```

3. Elysia WebSocket (Dalam Framework Elysia)

Jika kamu bekerja dengan Elysia (sebuah framework untuk Node.js), kamu dapat memanfaatkan integrasi WebSocket dengan cara serupa. Dokumentasi dan penggunaan spesifik dapat dilihat di dokumentasi resmi framework tersebut.

# Studi Kasus Project Websocket menggunakan Bun + Elysia + Drizzle

## 1. Setup project

seperti biasa kalian buat folder project untuk membuat ws app chat

```
mkdir ws-chat
cd ws-chat
bun init
```

lalu install library yang akan di gunakan
```
bun add elysiat drizzle-orm @neondatabase/serverless
bun add -D drizzle-kit bun-types .env
```

lalu buatlah structur folder project seperti ini
```
ws-chat/
├── src/
│   ├── db/
│   │   ├── schema/
│   │   │   ├── messages.ts
│   │   │   ├── users.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── types/
│   │   └── websocket.ts
│   ├── services/
│   │   ├── chat.service.ts
│   │   └── user.service.ts
│   └── index.ts
├── drizzle.config.ts
├── .env
└── package.json
```

## 2. Code

kalian bisa tiru code berikut dan di taruh ke dalam file yang sesuai

- src/db/schema/messages.ts
```js
import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';

import { users } from './users';

export const messages = pgTable('messages', {
    id: serial('id').primaryKey(),
    content: text('content').notNull(),
    userId: integer('user_id').references(() => users.id),
    createdAt: timestamp('created_at').defaultNow()
});
```

- src/db/schema/users.ts
```js
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    username: text('username').notNull().unique(),
    lastSeen: timestamp('last_seen').defaultNow()
});
```

- src/db/schema/index.ts
```js

import { users } from './users';
import { messages } from './messages';

export {
    users,
    messages
};
```

- src/db/index.ts
```js
import { drizzle } from 'drizzle-orm/neon-http';
import { neon, neonConfig } from '@neondatabase/serverless';
import * as schema from './schema';

neonConfig.fetchConnectionCache = true;

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });
```

- src/services/chat.service.ts
```js
import { db } from '../db';
import { messages, users } from '../db/schema';
import { eq } from 'drizzle-orm';

export class ChatService {
    async getRecentMessages(limit: number = 50) {
        return await db.select({
            id: messages.id,
            content: messages.content,
            username: users.username,
            createdAt: messages.createdAt
        })
        .from(messages)
        .leftJoin(users, eq(messages.userId, users.id))
        .limit(limit)
        .execute();
    }

    async saveMessage(username: string, content: string) {
        // First find the user
        const user = await db.select()
            .from(users)
            .where(eq(users.username, username))
            .limit(1)
            .execute();

        if (!user.length) return null;

        // Then save the message
        const result = await db.insert(messages)
            .values({
                content,
                userId: user[0].id
            })
            .returning()
            .execute();

        return {
            ...result[0],
            username
        };
    }
}
```

- src/services/user.service.ts
```js
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export class UserService {
    async createUser(username: string) {
        try {
            const result = await db.insert(users)
                .values({ username })
                .returning()
                .execute();
            return result[0];
        } catch (error) {
            // Handle unique constraint violation
            const existingUser = await db.select()
                .from(users)
                .where(eq(users.username, username))
                .limit(1)
                .execute();
            return existingUser[0];
        }
    }

    async updateLastSeen(username: string) {
        return await db.update(users)
            .set({ lastSeen: new Date() })
            .where(eq(users.username, username))
            .returning()
            .execute();
    }
}
```

- src/types/websocket.ts
```js
export interface ChatMessage {
  type: 'message' | 'join' | 'leave';
  username?: string;
  content?: string;
  timestamp?: Date;
}
```

- src/index.ts
```js
import { Elysia, t } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { ChatService } from './services/chat.service';
import { UserService } from './services/user.service';
import { staticPlugin } from '@elysiajs/static';

// Initialize services
const chatService = new ChatService();
const userService = new UserService();

// Track connected users
const connectedUsers = new Map<string, any>();

const app = new Elysia()
    .use(cors())
    // Configure Swagger with detailed documentation
    .use(swagger({
        documentation: {
            info: {
                title: 'Real-time Chat API',
                version: '1.0.0',
                description: 'API for real-time chat with both WebSocket and REST endpoints'
            },
            tags: [
                { name: 'Messages', description: 'Message operations' },
                { name: 'Users', description: 'User management' },
                { name: 'WebSocket', description: 'WebSocket connection info' }
            ]
        }
    }))
    // REST endpoint to get WebSocket connection details
    .get('/ws-info',
        () => ({
            websocketUrl: 'ws://localhost:3000/ws',
            messageFormats: {
                join: { type: 'join', username: 'string' },
                message: { type: 'message', username: 'string', content: 'string' },
                leave: { type: 'leave', username: 'string' }
            }
        }),
        {
            detail: {
                tags: ['WebSocket'],
                summary: 'Get WebSocket connection information',
                description: 'Returns WebSocket URL and message format examples'
            }
        }
    )
    // REST endpoint to get recent messages
    .get('/messages',
        async ({ query }) => {
            const limit = Number(query?.limit || 50);
            return await chatService.getRecentMessages(limit);
        },
        {
            query: t.Object({
                limit: t.Optional(t.Number({
                    default: 50,
                    minimum: 1,
                    maximum: 100
                }))
            }),
            detail: {
                tags: ['Messages'],
                summary: 'Get recent messages',
                description: 'Retrieve recent chat messages from the database'
            }
        }
    )
    // REST endpoint to send a message
    .post('/messages',
        async ({ body }) => {
            const message = await chatService.saveMessage(body.username, body.content);
            if (message) {
                broadcastMessage({
                    type: 'message',
                    username: body.username,
                    content: body.content,
                    timestamp: new Date()
                });
                return message;
            }
            throw new Error('Failed to save message');
        },
        {
            body: t.Object({
                username: t.String({
                    minLength: 1,
                    description: 'Username of the sender'
                }),
                content: t.String({
                    minLength: 1,
                    description: 'Message content'
                })
            }),
            detail: {
                tags: ['Messages'],
                summary: 'Send a new message',
                description: 'Send a message through REST API (will be broadcast to WebSocket clients)'
            }
        }
    )
    // REST endpoint to get active users
    .get('/users/active',
        () => Array.from(connectedUsers.keys()),
        {
            detail: {
                tags: ['Users'],
                summary: 'Get active users',
                description: 'List all currently connected users'
            }
        }
    )
    // REST endpoint to create a new user
    .post('/users',
        async ({ body }) => {
            return await userService.createUser(body.username);
        },
        {
            body: t.Object({
                username: t.String({
                    minLength: 1,
                    description: 'Username to register'
                })
            }),
            detail: {
                tags: ['Users'],
                summary: 'Register a new user',
                description: 'Create a new user in the system'
            }
        }
    )
    // WebSocket endpoint
    .ws('/ws', {
        message: async (ws, message: any) => {
            try {
                switch (message.type) {
                    case 'join':
                        const user = await userService.createUser(message.username);
                        if (user) {
                            connectedUsers.set(message.username, ws);
                            
                            // Send welcome message
                            ws.send({
                                type: 'system',
                                content: `Welcome ${message.username}!`,
                                timestamp: new Date()
                            });

                            // Load and send recent messages
                            const recentMessages = await chatService.getRecentMessages(10);
                            for (const msg of recentMessages) {
                                ws.send({
                                    type: 'message',
                                    username: msg.username,
                                    content: msg.content,
                                    timestamp: msg.createdAt
                                });
                            }

                            broadcastMessage({
                                type: 'system',
                                content: `${message.username} joined the chat`,
                                timestamp: new Date()
                            }, ws);
                        }
                        break;

                    case 'message':
                        if (message.content && message.username) {
                            const savedMessage = await chatService.saveMessage(
                                message.username,
                                message.content
                            );
                            if (savedMessage) {
                                broadcastMessage({
                                    type: 'message',
                                    username: message.username,
                                    content: message.content,
                                    timestamp: new Date()
                                });
                            }
                        }
                        break;

                    case 'leave':
                        if (message.username) {
                            await handleUserLeave(message.username);
                        }
                        break;
                }
            } catch (error) {
                console.error('WebSocket error:', error);
                ws.send({
                    type: 'error',
                    content: 'An error occurred processing your message'
                });
            }
        }
    })
    .listen(3000);

// Add this to your Elysia app configuration
app.use(staticPlugin())
.get('/test', () => Bun.file('./public/ws-tester.html'));


// Utility functions
function broadcastMessage(message: any, excludeWs?: any) {
    for (const [_, ws] of connectedUsers.entries()) {
        if (ws !== excludeWs) {
            ws.send(message);
        }
    }
}

async function handleUserLeave(username: string) {
    await userService.updateLastSeen(username);
    connectedUsers.delete(username);
    broadcastMessage({
        type: 'system',
        content: `${username} left the chat`,
        timestamp: new Date()
    });
}

console.log(`🚀 Server running at http://localhost:3000`);
console.log(`📚 Swagger documentation at http://localhost:3000/swagger`);
console.log(`🔌 WebSocket endpoint at ws://localhost:3000/ws`);

export type App = typeof app;
```

- package.json
```json
{
  "name": "ws_chat",
  "version": "1.0.0",
  "scripts": {
    "dev": "bun run --watch src/index.ts",
    "db:generate": "drizzle-kit generate",
    "db:push": "drizzle-kit push"
  },
  "dependencies": {
    "@elysiajs/cors": "^1.1.1",
    "@elysiajs/static": "^1.1.1",
    "@elysiajs/websocket": "^0.2.8",
    "@neondatabase/serverless": "^0.10.4",
    "drizzle-orm": "^0.37.0",
    "elysia": "^1.1.26"
  },
  "devDependencies": {
    "@types/node": "^22.10.1",
    "bun-types": "latest",
    "dotenv": "^16.4.7",
    "drizzle-kit": "^0.29.1",
    "typescript": "^5.7.2",
    "@elysiajs/swagger": "^1.1.6"
  }
}
```

- drizzle.config.ts
```ts
import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
    dialect: "postgresql",
    schema: './src/db/schema/*',
    out: './src/db/migrations',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
    verbose: true,
} satisfies Config;
```

## 3. .ENV and Running

1. buat file .env di dalam project mu dan masukan variable berikut
```
DATABASE_URL=postgres://your-username:your-password@your-neon-host/your-database
```
gunakan url neon database milik mu dengan cara buka website dan masuk

2. migration database
```
bun run db:generate
bun run db:push
```
pertama migrate terlebih dahulu schema databasenya lalu di buse ke dalam database, jika berhasil bisa di lihat pada table db neon kalian di website atau 

3. running and testing

setelah kalian run dengan `bun run dev` kalian bisa buka documentation di swagger `http://localhost:300/swagger` 
lalu untuk mencobanya pertama kalian buat user terlebih dahulu lalu ke api message dan coba api tersebut.