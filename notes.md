---
layout: page
title: "Notes"
permalink: /notes/
---


<ul>
  {% for note in site.notes %}
    <li>
      <a href="{{ note.url }}">{{ note.title }}</a> 
    </li>
  {% endfor %}
</ul>
