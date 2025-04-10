This is a project for online previewing of Markdown documents. It allows us to view Markdown content in a visually enhanced format and easily copy it for publishing on social media platforms.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy with docker

put your books at `/home/Books`

```
docker build  -t md-book .

docker run -d -p 3000:3000 -v /home/Books:/app/Books --name mybooks md-book
```