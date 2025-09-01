---
layout: page
title: "Notes"
permalink: /notes/
---

<h3>Notes</h3>
<ul>
  {% for note in site.notes %}
    <li>
      <a href="{{ note.url }}">{{ note.title }}</a> – {{ note.date | date: "%Y-%m-%d" }}
    </li>
  {% endfor %}
</ul>
