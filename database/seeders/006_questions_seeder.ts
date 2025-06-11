import { Seeder } from '@/lib/database/seeder';
import { Db, ObjectId } from 'mongodb';

const seeder: Seeder = {
  name: '006_questions_seeder',

  async run(db: Db) {
    const questions = db.collection('questions');
    const categories = db.collection('categories');

    // Check if questions already exist
    const existingCount = await questions.countDocuments();

    // if (existingCount > 0) {
    //   console.log('Questions already exist, skipping...');
    //   return;
    // }

    // Get category IDs
    const categoryDocs = await categories.find({}).toArray();
    const categoryMap = new Map(categoryDocs.map(cat => [cat.name, cat._id.toString()]));

    const sampleQuestions = [
      {
        question: 'What is Node.js?',
        answer: `<p><strong>Node.js</strong> is an open-source runtime that lets you run JavaScript on the server, powered by Google’s V8 engine.</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'What is npm and why is it important?',
        answer: `<p><strong>npm</strong> (Node Package Manager) is the default package manager for Node.js. It hosts reusable libraries and makes dependency management easy with a single command: <code>npm install &lt;package&gt;</code>.</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'What does a package.json file describe?',
        answer: `<p><code>package.json</code> stores metadata about the project—name, version, scripts, dependencies, and more—so anyone can install and run it consistently.</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'How do you print something to the console in Node.js?',
        answer: `<pre><code>console.log('Hello Node');</code></pre>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'Explain the difference between <code>require</code> and <code>import</code>.',
        answer: `<p><code>require()</code> is the CommonJS loader used in classic Node. <code>import</code> is the ES Module syntax; it is static and supports tree-shaking. Modern Node allows both (with proper flags or file extensions).</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'What is the event loop in Node.js?',
        answer: `<p>The <strong>event loop</strong> is the heart of Node’s concurrency model. It continuously picks up callbacks from the task queue and executes them on the single JavaScript thread, giving Node its non-blocking behavior.</p>
<pre><code>// simplified view
while (queue.waitForTask()) {
  process.nextTask();
}</code></pre>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'What is a callback?',
        answer: `<p>A <strong>callback</strong> is a function passed as an argument to be executed later, usually after an asynchronous operation completes.</p>
<pre><code>fs.readFile('file.txt', (err, data) =&gt; {
  if (err) throw err;
  console.log(data.toString());
});</code></pre>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'What is “callback hell” and how can you avoid it?',
        answer: `<p>Nested callbacks cause unreadable “pyramid code.” Use Promises or <code>async/await</code> to flatten it.</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'What are Promises in Node.js?',
        answer: `<p>A <strong>Promise</strong> represents the eventual result of an asynchronous task and lets you chain logic cleanly.</p>
<pre><code>fetchUser()
  .then(saveUser)
  .catch(console.error);</code></pre>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'How does <code>async/await</code> make asynchronous code easier?',
        answer: `<p><code>async/await</code> lets you write asynchronous code that looks synchronous, handling Promises behind the scenes.</p>
<pre><code>async function main() {
  try {
    const user = await fetchUser();
    await saveUser(user);
  } catch (e) {
    console.error(e);
  }
}</code></pre>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'What is the process object?',
        answer: `<p><code>process</code> is a global object giving information and control over the current Node.js process (env vars, PID, exit codes).</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'Name two ways to read a file in Node.js.',
        answer: `<pre><code>// 1. Synchronous
const data = fs.readFileSync('file.txt', 'utf8');

// 2. Asynchronous
fs.readFile('file.txt', 'utf8', (err, data) =&gt; { ... });</code></pre>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'What is Express.js?',
        answer: `<p><strong>Express</strong> is a minimal, unopinionated web framework for Node that simplifies routing, middleware, and request/response handling.</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'Write a simple “Hello World” HTTP server without Express.',
        answer: `<pre><code>const http = require('http');
http.createServer((req, res) =&gt; {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World');
}).listen(3000);</code></pre>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'What are environment variables and how do you access them?',
        answer: `<p>Environment variables hold runtime config. Access with <code>process.env.KEY</code>. Use packages like <code>dotenv</code> to load from a <code>.env</code> file.</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'Explain CORS in simple terms.',
        answer: `<p><strong>CORS</strong> is a browser security rule that restricts cross-origin HTTP requests. Servers send headers like <code>Access-Control-Allow-Origin</code> to allow them.</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'What is middleware in Express?',
        answer: `<p>A function that gets the request and response objects plus <code>next()</code>. You can inspect, modify, or end the request.</p>
<pre><code>app.use((req, res, next) =&gt; {
  console.log(req.method, req.url);
  next(); // pass control
});</code></pre>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'How do you send JSON from an Express route?',
        answer: `<pre><code>app.get('/api', (req, res) =&gt; {
  res.json({ message: 'Hi' });
});</code></pre>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'What does nodemon do?',
        answer: `<p><code>nodemon</code> monitors your source files and automatically restarts the server when they change—handy in development.</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'What is the Node.js REPL?',
        answer: `<p>The Read-Eval-Print Loop is an interactive shell where you can run JavaScript commands line by line.</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      /* ----------------- Intermediate (21-35) ----------------- */
      {
        question: 'What are Buffers in Node.js and why are they useful?',
        answer: `<p><strong>Buffer</strong> objects represent fixed-length raw binary data. They let Node handle files, TCP streams, etc., efficiently.</p>
<pre><code>const buf = Buffer.from('hello');</code></pre>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'Describe the different types of Streams.',
        answer: `<p>There are 4 main stream types: <em>Readable</em>, <em>Writable</em>, <em>Duplex</em> (both), and <em>Transform</em> (modifies data on the fly).</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'What is backpressure in streams and how do you handle it?',
        answer: `<p>Backpressure occurs when the writable side can’t keep up with the readable side. Use <code>stream.pipe()</code> which manages flow control automatically.</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'Explain the difference between process.nextTick() and setImmediate().',
        answer: `<p><code>process.nextTick()</code> queues a microtask executed <em>before</em> the next event loop phase; <code>setImmediate()</code> queues a macrotask executed after the poll phase.</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'What is an EventEmitter?',
        answer: `<p><code>EventEmitter</code> is a class that lets you create and handle custom events.</p>
<pre><code>emitter.on('done', () =&gt; console.log('Finished'));</code></pre>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'How do you handle uncaught exceptions in Node.js?',
        answer: `<pre><code>process.on('uncaughtException', (err) =&gt; {
  console.error('Uncaught:', err);
  process.exit(1);
});</code></pre>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'What is clustering and why would you use it?',
        answer: `<p>Clustering starts multiple Node processes (workers) to use multi-core CPUs and improve throughput.</p>
<pre><code>if (cluster.isMaster) {
  cluster.fork(); // create workers
} else {
  // server logic
}</code></pre>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'What are Worker Threads?',
        answer: `<p>Worker Threads let you run JS in parallel threads inside the same process, ideal for CPU-heavy tasks without blocking the event loop.</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'Why is bottom-up logging better than console.log everywhere?',
        answer: `<p>Using libraries like <code>winston</code> or <code>pino</code> gives levels (info, warn, error), persistence, and better performance.</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'How do you secure passwords in a Node.js API?',
        answer: `<p>Never store plain text. Hash with <code>bcrypt</code>, add salt, store only the hash.</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'Explain JWT authentication flow in Node.js.',
        answer: `<p>Server signs a token with a secret; client stores it (usually in a cookie). Each request sends the token, server verifies and grants access.</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'How do you handle file uploads in Node?',
        answer: `<p>Use middleware like <code>multer</code> to parse <code>multipart/form-data</code> and store files.</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'What is a middleware order problem and how do you debug it?',
        answer: `<p>If middleware is placed after a route, it never runs. Ensure <code>app.use()</code> statements appear before routes that depend on them.</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'How do you perform unit tests in Node.js?',
        answer: `<p>Use a test runner like <code>jest</code> or <code>mocha</code>, write assertions, and mock external calls.</p>
<pre><code>test('sum', () =&gt; {
  expect(sum(2, 3)).toBe(5);
});</code></pre>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      /* ---------------------- Advanced (36-50) ---------------------- */
      {
        question: 'Explain garbage collection in V8.',
        answer: `<p>V8 uses generational GC: <em>Young</em> space collected frequently (Scavenge), <em>Old</em> space less often (Mark-Sweep/Compact). Optimized for short-lived objects.</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'What are native C++ addons and when would you write one?',
        answer: `<p>Addons let you write performance-critical code in C++ and expose it to JS via N-API or node-addon-api.</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'Compare Cluster vs Worker Threads.',
        answer: `<ul><li><strong>Cluster:</strong> Separate processes ✓ memory isolation ✗ IPC overhead</li><li><strong>Worker Thread:</strong> Same process ✓ shared memory ✗ still some overhead</li></ul>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'How do you detect a memory leak in Node.js?',
        answer: `<p>Use the <code>--inspect</code> flag, Chrome DevTools heap snapshots, and <code>clinic.js</code> or <code>heapdump</code> to pinpoint leaks.</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'What is backpressure in HTTP servers and how can you mitigate it?',
        answer: `<p>When inbound requests arrive faster than they can be processed, queue work, use reverse proxies, or shed load with rate-limiting.</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'Explain how HTTP/2 can improve Node.js performance.',
        answer: `<p>Multiplexing multiple streams over one TCP connection, header compression, and server push reduce latency.</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'What is the “single-threaded” myth in Node.js?',
        answer: `<p>JS runs on one thread, but I/O and native operations use the thread-pool or OS kernels, so Node can handle many tasks concurrently.</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'Describe how to build a real-time chat with Socket.io.',
        answer: `<p>Socket.io sits on WebSockets. Clients emit events (<code>socket.emit('msg')</code>), server broadcasts (<code>io.emit()</code>) for instant updates.</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'How do you implement graceful shutdown?',
        answer: `<pre><code>process.on('SIGTERM', () =&gt; {
  server.close(() =&gt; process.exit(0));
});</code></pre>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'What is rate limiting and one way to implement it in Node.js?',
        answer: `<p>Rate limiting restricts the number of requests a client can make. Use middleware like <code>express-rate-limit</code> or an external gateway.</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'How can you handle large file transfers efficiently?',
        answer: `<p>Stream the file with <code>fs.createReadStream()</code> so memory usage stays low.</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'Explain micro-task vs macro-task queues in the event loop.',
        answer: `<p>Micro-tasks (Promises) run after the current operation but before I/O callbacks; macro-tasks (setTimeout, I/O) run in later phases.</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'What is HTTP keep-alive and why does it matter?',
        answer: `<p>Keep-alive reuses TCP connections for multiple requests, saving handshake time and improving performance.</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'Describe a strategy to containerize a Node.js app for production.',
        answer: `<p>Use a multi-stage Dockerfile: build in one stage, copy compiled assets into a slim runtime (e.g., <code>node:20-alpine</code>) stage for smaller images.</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'How do serverless functions differ from a traditional Node server?',
        answer: `<p>Serverless runs small functions on demand, scaling instantly; no long-running processes. You deploy individual handlers (e.g., AWS Lambda) instead of Express servers.</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        question: 'What is ts-node and why might you use it?',
        answer: `<p><code>ts-node</code> runs TypeScript files directly without precompilation—handy in development for rapid iteration.</p>`,
        difficulty: 'Medium',
        categoryId: categoryMap.get('Node'),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    // Filter out questions for categories that don't exist
    const validQuestions = sampleQuestions.filter(q => q.categoryId);

    await questions.insertMany(validQuestions);
    console.log(`Created ${validQuestions.length} sample questions`);
  }
};

export default seeder;