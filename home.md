---
layout: default
title: Home
---


<div class="home">
  <h1>Najnovšie články</h1>

  <ul class="post-list">
    {% for post in site.posts limit:5 %}
      <li style="margin-bottom: 40px;">
        
        <!-- Nadpis -->
        <h2 style="font-size: 1.3em; margin-bottom: 5px;">
          <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        </h2>

        <!-- Meta informácie -->
        <p class="post-meta">
          {{ post.date | date: "%d.%m.%Y" }}
          {% if post.author %} • {{ post.author }}{% endif %}
          •
          {% assign tag = post.tags | sort %}          
            {% if tag %}
              {% for t in tag %}
                <span><a href="{{ site.baseurl }}/category/?c={{ t | slugify }}">{{ t }}</a>{% if forloop.last != true %},{% endif %}</span>
              {% endfor %}
            {% endif %}
            {% assign tag = nil %}
        </p>

        <!-- Obrázok -->
        {% if post.image %}
          <div class="post-image">
            <a href="{{ post.url | relative_url }}">
              <img src="{{ post.image | relative_url }}" alt="{{ post.title }}" style="max-width: 450px; border-radius: 12px;">
            </a>
          </div>
        {% endif %}
      </li>
    {% endfor %}
  </ul>
</div>





<!--
<div class="home">
  <h1>Najnovšie články</h1>

  <ul class="post-list">
    {% for post in site.posts limit:5 %}
      <li style="margin-bottom: 40px;">
        
        <!-- Nadpis -->
        <h2 style="font-size: 1.3em; margin-bottom: 5px;">
          <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        </h2>

        <!-- Meta informácie -->
        <p class="post-meta">
          {{ post.date | date: "%d.%m.%Y" }}
          {% if post.author %} • {{ post.author }}{% endif %}
          •
          {% assign tag = post.tags | sort %}          
            {% for category in tag %}<span><a href="{{ site.baseurl }}category/#{{ category }}" class="reserved">{{ category }}</a>{% if forloop.last != true %},{% endif %}</span>{% endfor %}
            {% assign tag = nil %}
        </p>

        <!-- Obrázok -->
        {% if post.image %}
          <div class="post-image">
            <a href="{{ post.url | relative_url }}">
              <img src="{{ post.image | relative_url }}" alt="{{ post.title }}" style="max-width: 450px; border-radius: 12px;">
            </a>
          </div>
        {% endif %}
      </li>
    {% endfor %}
  </ul>
</div> 




