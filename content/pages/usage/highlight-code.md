---
Title: Highlight Node.js Code Title
Sort: 2
---

# Introduction
You can highlight code by using the HTML pattern in your Markdown like this:  
```
<pre><code>
Code goes here...
</code></pre>
```
You language should be detected automatically but it's better to be explicit.  
```
<pre><code class="language-javascript">
Code goes here...
</code></pre>
```
The list of languages is on this [highlight.js documentation page](https://highlightjs.readthedocs.io/en/latest/supported-languages.html)

## Node.js Code
<pre><code class="language-javascript">let value = 'variable';
const OK = true;
function fn() {
	console.log("Works");
}
</code></pre>

## SQL Code
<pre><code class="language-sql">CREATE TABLE "topic" (
    "id" integer NOT NULL PRIMARY KEY,
    "forum_id" integer NOT NULL,
    "subject" varchar(255) NOT NULL
);
ALTER TABLE "topic"
ADD CONSTRAINT forum_id FOREIGN KEY ("forum_id")
REFERENCES "forum" ("id");

-- Initials
insert into "topic" ("forum_id", "subject")
values (2, 'D''artagnian');
</code></pre>
