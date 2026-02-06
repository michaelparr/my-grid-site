document.addEventListener('DOMContentLoaded', function() {
  fetch('data/posts.json')
    .then(res => res.json())
    .then(data => {
       const postsEl = document.getElementById('posts');
       const singleEl = document.getElementById('singlePost');
       const tagNav = document.getElementById('tagNav');
       const overlay = document.getElementById('overlay');
       const filterOpen = document.getElementById('filterOpen');
       const filterClose = document.getElementById('filterClose');
       if (filterOpen && filterClose && overlay) {
           filterOpen.addEventListener('click', (e) => { e.preventDefault(); overlay.style.display = 'block'; });
           filterClose.addEventListener('click', (e) => { e.preventDefault(); overlay.style.display = 'none'; });
       }
       const posts = data.posts || [];
       const siteTitle = data.site && data.site.title ? data.site.title : document.title;
       // build tag nav
       if (tagNav && data.tags) {
           tagNav.innerHTML = data.tags.map(t => '<li><a href="#" data-tag="'+t.slug+'">'+t.title+'</a></li>').join('');
           tagNav.addEventListener('click', function(e) {
              const a = e.target.closest('a[data-tag]');
              if (a) {
                 e.preventDefault();
                 const tag = a.getAttribute('data-tag');
                 renderPosts(tag);
                 if (overlay) overlay.style.display = 'none';
              }
           });
       }
       const urlParams = new URLSearchParams(window.location.search);
       const id = urlParams.get('id');
       function renderPosts(filterTag) {
           if (!postsEl) return;
           postsEl.innerHTML = '';
           let list = posts.slice();
           if (filterTag) list = list.filter(p => (p.tags || []).includes(filterTag));
           list.forEach(post => {
             const article = document.createElement('article');
             article.className = 'post ' + post.type;
             let inner = '';
             let bottom = '<div class="post__bottom clearfix post__bottom--light"><ul class="post__buttons"><li>' + (post.date || '') + '</li></ul></div>';
             if (post.type === 'photo') {
               inner += '<div class="post__photo"><img src="' + post.image + '" alt="' + (post.alt || '') + '"></div>';
               if (post.captionHtml) inner += '<div class="caption photo__caption">' + post.captionHtml + '</div>';
             } else if (post.type === 'text') {
               inner += '<div class="post__text">' + (post.title ? '<h3 class="text__title">' + post.title + '</h3>' : '') + post.html + '</div>';
             } else if (post.type === 'quote') {
               inner += '<div class="post__quote"><blockquote class="words">' + post.quote + '</blockquote>' + (post.source ? '<p class="quote__source">&mdash; ' + post.source + '</p>' : '') + '</div>';
             } else if (post.type === 'link') {
               inner += '<div class="post__link"><h3 class="link__title"><a href="' + post.url + '" target="_blank" rel="noopener">' + (post.name || post.url) + ' →</a></h3>' + (post.descriptionHtml || '') + '</div>';
             }
             article.innerHTML = inner + bottom;
             postsEl.appendChild(article);
           });
       }
       if (id) {
           // show single post
           const found = posts.find(p => p.id === id);
           if (found && singleEl) {
             let html = '';
             if (found.type === 'photo') {
                html = '<div class="post__photo"><img src="' + found.image + '" alt="' + (found.alt || '') + '"></div>';
                if (found.captionHtml) html += '<div class="caption photo__caption">' + found.captionHtml + '</div>';
             } else if (found.type === 'text') {
                html = '<div class="post__text">' + (found.title ? '<h3 class="text__title">' + found.title + '</h3>' : '') + found.html + '</div>';
             } else if (found.type === 'quote') {
                html = '<div class="post__quote"><blockquote class="words">' + found.quote + '</blockquote>' + (found.source ? '<p class="quote__source">&mdash; ' + found.source + '</p>' : '') + '</div>';
             } else if (found.type === 'link') {
                html = '<div class="post__link"><h3 class="link__title"><a href="' + found.url + '" target="_blank" rel="noopener">' + (found.name || found.url) + ' →</a></h3>' + (found.descriptionHtml || '') + '</div>';
             }
             singleEl.innerHTML = html;
             document.title = (found.title ? found.title + ' — ' : '') + siteTitle;
           }
       } else {
           renderPosts();
       }
    })
    .catch(err => console.error(err));
});
