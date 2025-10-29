// Client-side minimal logic: signup, login, add child, list children, screening flows, therapist search
(async function(){
  const api = (path, opts={})=>{
    return fetch('/api'+path, Object.assign({
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin'
    }, opts)).then(r=>r.json());
  };

  // Useful helpers
  function q(sel){ return document.querySelector(sel); }
  function qa(sel){ return document.querySelectorAll(sel); }

  // Signup form
  const signupForm = q('#signupForm');
  if (signupForm){
    signupForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const msgEl = q('#signupMsg');
      const fd = new FormData(signupForm);
      const body = { name: fd.get('name'), email: fd.get('email'), password: fd.get('password') };

      try {
        const res = await api('/signup', { method: 'POST', body: JSON.stringify(body) });
        if (res.ok) {
          msgEl.className = 'alert alert-success';
          msgEl.style.display = 'block';
          msgEl.innerHTML = '<span class="msg-icon"></span><div>' + (res.message || 'Account created successfully!') + '</div>';
          if (typeof getIcon === 'function') {
            const icon = msgEl.querySelector('.msg-icon');
            if (icon) icon.innerHTML = getIcon('check');
          }
          if (typeof toast !== 'undefined') toast.show(res.message || 'Account created successfully!', 'success');
          setTimeout(()=> location.href='/login.html', 1500);
        } else {
          msgEl.className = 'alert alert-danger';
          msgEl.style.display = 'block';
          msgEl.innerHTML = '<span class="msg-icon"></span><div>' + (res.message || 'Signup failed') + '</div>';
          if (typeof getIcon === 'function') {
            const icon = msgEl.querySelector('.msg-icon');
            if (icon) icon.innerHTML = getIcon('alertCircle');
          }
          if (typeof toast !== 'undefined') toast.show(res.message || 'Signup failed', 'danger');
        }
      } catch (error) {
        msgEl.className = 'alert alert-danger';
        msgEl.style.display = 'block';
        msgEl.innerHTML = '<span class="msg-icon"></span><div>Network error. Please try again.</div>';
        if (typeof getIcon === 'function') {
          const icon = msgEl.querySelector('.msg-icon');
          if (icon) icon.innerHTML = getIcon('alertCircle');
        }
        if (typeof toast !== 'undefined') toast.show('Network error. Please try again.', 'danger');
      }
    });
  }

  // Login
  const loginForm = q('#loginForm');
  if (loginForm){
    loginForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const msgEl = q('#loginMsg');
      const fd = new FormData(loginForm);
      const body = { email: fd.get('email'), password: fd.get('password') };

      try {
        const res = await api('/login', { method: 'POST', body: JSON.stringify(body) });
        if (res.ok) {
          msgEl.className = 'alert alert-success';
          msgEl.style.display = 'block';
          msgEl.innerHTML = '<span class="msg-icon"></span><div>' + (res.message || 'Login successful!') + '</div>';
          if (typeof getIcon === 'function') {
            const icon = msgEl.querySelector('.msg-icon');
            if (icon) icon.innerHTML = getIcon('check');
          }
          if (typeof toast !== 'undefined') toast.show(res.message || 'Login successful!', 'success');
          setTimeout(()=> location.href='/', 1000);
        } else {
          msgEl.className = 'alert alert-danger';
          msgEl.style.display = 'block';
          msgEl.innerHTML = '<span class="msg-icon"></span><div>' + (res.message || 'Login failed') + '</div>';
          if (typeof getIcon === 'function') {
            const icon = msgEl.querySelector('.msg-icon');
            if (icon) icon.innerHTML = getIcon('alertCircle');
          }
          if (typeof toast !== 'undefined') toast.show(res.message || 'Login failed', 'danger');
        }
      } catch (error) {
        msgEl.className = 'alert alert-danger';
        msgEl.style.display = 'block';
        msgEl.innerHTML = '<span class="msg-icon"></span><div>Network error. Please try again.</div>';
        if (typeof getIcon === 'function') {
          const icon = msgEl.querySelector('.msg-icon');
          if (icon) icon.innerHTML = getIcon('alertCircle');
        }
        if (typeof toast !== 'undefined') toast.show('Network error. Please try again.', 'danger');
      }
    });
  }

  // Add child
  const childForm = q('#childForm');
  async function refreshChildren(){
    const list = q('#childrenList');
    const select = q('#childSelect');
    
    // Need at least one of these elements to proceed
    if (!list && !select) return;
    
    const res = await api('/children');
    if (!res || !res.ok) { 
      if (list) {
        list.innerHTML = '<div class="alert alert-warning" style="margin: 0;"><span id="alert-icon-list"></span><div>Please log in to manage children.</div></div>'; 
        if (typeof getIcon === 'function') {
          const alertIcon = document.getElementById('alert-icon-list');
          if (alertIcon) alertIcon.innerHTML = getIcon('alertCircle');
        }
      }
      if (select) {
        select.innerHTML = '<option value="">-- Please log in first --</option>';
      }
      return; 
    }
    const children = res.children || [];
    
    // Update children list with modern card design
    if (list) {
      if (children.length === 0) {
        list.innerHTML = '<div style="text-align: center; padding: var(--space-8); color: var(--color-text-muted);"><span id="empty-icon" style="display: block; margin: 0 auto var(--space-3); width: 48px; height: 48px;"></span><p style="font-size: var(--font-size-lg); margin-bottom: var(--space-2);">No children added yet</p><p style="font-size: var(--font-size-sm);">Add your first child using the form above to get started with screenings.</p></div>';
        if (typeof getIcon === 'function') {
          const emptyIcon = document.getElementById('empty-icon');
          if (emptyIcon) emptyIcon.innerHTML = getIcon('users');
        }
      } else {
        list.innerHTML = '<div style="display: grid; gap: var(--space-4);">' + 
          children.map(c => `
            <div class="card" style="padding: var(--space-4);">
              <div style="display: flex; align-items: start; gap: var(--space-3);">
                <div style="width: 48px; height: 48px; background: var(--color-primary-light); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: var(--color-primary); flex-shrink: 0;">
                  <span class="child-icon-${c.id}"></span>
                </div>
                <div style="flex: 1; min-width: 0;">
                  <h3 style="margin: 0 0 var(--space-2) 0; font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold);">${c.name}</h3>
                  <p style="margin: 0; color: var(--color-text-muted); font-size: var(--font-size-sm);">
                    <strong>Age:</strong> ${c.age} years old
                  </p>
                  ${c.notes ? `<p style="margin: var(--space-2) 0 0 0; color: var(--color-text-muted); font-size: var(--font-size-sm);"><strong>Notes:</strong> ${c.notes}</p>` : ''}
                </div>
                <div style="display: flex; gap: var(--space-2);">
                  <button class="btn btn-ghost btn-sm" title="Edit child" style="padding: var(--space-2);">
                    <span class="edit-icon-${c.id}"></span>
                  </button>
                  <button class="btn btn-danger btn-sm" title="Delete child" style="padding: var(--space-2);">
                    <span class="delete-icon-${c.id}"></span>
                  </button>
                </div>
              </div>
            </div>
          `).join('') + '</div>';
        
        // Initialize icons for each child card
        if (typeof getIcon === 'function') {
          children.forEach(c => {
            const childIcon = document.querySelector(`.child-icon-${c.id}`);
            const editIcon = document.querySelector(`.edit-icon-${c.id}`);
            const deleteIcon = document.querySelector(`.delete-icon-${c.id}`);
            if (childIcon) childIcon.innerHTML = getIcon('baby');
            if (editIcon) editIcon.innerHTML = getIcon('edit');
            if (deleteIcon) deleteIcon.innerHTML = getIcon('trash');
          });
        }
      }
    }
    
    // Update dropdown select for screening page
    if (select){
      select.innerHTML = '<option value="">-- Select a child --</option>' + 
        children.map(c=>`<option value="${c.id}">${c.name} (age ${c.age})</option>`).join('');
    }
  }
  if (childForm){
    childForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const msgEl = q('#childMsg');
      const fd = new FormData(childForm);
      const body = { name: fd.get('name'), age: fd.get('age'), notes: fd.get('notes') };

      try {
        const res = await api('/children', { method:'POST', body: JSON.stringify(body) });
        if (res.ok) {
          msgEl.className = 'alert alert-success';
          msgEl.style.display = 'block';
          msgEl.innerHTML = '<span class="msg-icon"></span><div>' + (res.message || 'Child added successfully!') + '</div>';
          if (typeof getIcon === 'function') {
            const icon = msgEl.querySelector('.msg-icon');
            if (icon) icon.innerHTML = getIcon('check');
          }
          if (typeof toast !== 'undefined') toast.show(res.message || 'Child added successfully!', 'success');
          childForm.reset();
          refreshChildren();
          // Hide message after 3 seconds
          setTimeout(() => { msgEl.style.display = 'none'; }, 3000);
        } else {
          msgEl.className = 'alert alert-danger';
          msgEl.style.display = 'block';
          msgEl.innerHTML = '<span class="msg-icon"></span><div>' + (res.message || 'Failed to add child') + '</div>';
          if (typeof getIcon === 'function') {
            const icon = msgEl.querySelector('.msg-icon');
            if (icon) icon.innerHTML = getIcon('alertCircle');
          }
          if (typeof toast !== 'undefined') toast.show(res.message || 'Failed to add child', 'danger');
        }
      } catch (error) {
        msgEl.className = 'alert alert-danger';
        msgEl.style.display = 'block';
        msgEl.innerHTML = '<span class="msg-icon"></span><div>Network error. Please try again.</div>';
        if (typeof getIcon === 'function') {
          const icon = msgEl.querySelector('.msg-icon');
          if (icon) icon.innerHTML = getIcon('alertCircle');
        }
        if (typeof toast !== 'undefined') toast.show('Network error. Please try again.', 'danger');
      }
    });
    refreshChildren();
  }

  // Screening
  const questionArea = q('#questionArea');
  const resultArea = q('#resultArea');
  if (q('#startAsd') || q('#startAdhd') || q('#startDys')){
    const disorders = { '#startAsd': 'ASD', '#startAdhd': 'ADHD', '#startDys': 'Dyslexia' };
    Object.keys(disorders).forEach(btnSel=>{
      const btn = q(btnSel);
      if (!btn) return;
      btn.addEventListener('click', async ()=>{
        const childId = q('#childSelect') ? q('#childSelect').value : null;
        if (!childId){ alert('Please add/select a child first.'); return; }
        const disorder = disorders[btnSel];
        const qs = await api(`/questions?disorder=${disorder}`);
        if (!qs.ok){ questionArea.innerHTML = '<p class="muted-note">Problem loading questions. Please log in.</p>'; return; }
        const questions = qs.questions || [];
        // Build UI
        questionArea.innerHTML = `<h3>${disorder} Questionnaire</h3>`;
        questions.forEach(qObj=>{
          const div = document.createElement('div');
          div.className='question';
          div.dataset.id = qObj.id;
          div.innerHTML = `<div><strong>${qObj.question_text}</strong></div>`;
          const choices = document.createElement('div');
          choices.className='choices';
          const labels = ['Never','Rarely','Sometimes','Often','Very Often'];
          labels.forEach((lab, idx)=>{
            const btn = document.createElement('button');
            btn.type='button';
            btn.className='choice';
            btn.textContent = lab;
            btn.dataset.score = idx; // 0..4
            btn.addEventListener('click', ()=>{
              // unselect siblings
              choices.querySelectorAll('.choice').forEach(c=>c.classList.remove('selected'));
              btn.classList.add('selected');
              div.dataset.score = btn.dataset.score;
            });
            choices.appendChild(btn);
          });
          div.appendChild(choices);
          questionArea.appendChild(div);
        });
        // Submit button
        const submitBtn = document.createElement('button');
        submitBtn.className='btn primary';
        submitBtn.textContent='Submit Responses';
        submitBtn.addEventListener('click', async ()=>{
          // collect
          const answers = Array.from(questionArea.querySelectorAll('.question')).map(d=>{
            return { question_id: Number(d.dataset.id), answer_score: Number(d.dataset.score || 0) };
          });
          const stateVal = q('#stateInput') ? q('#stateInput').value : '';
          const payload = { child_id: Number(childId), disorder, state: stateVal, answers };
          const res = await api('/screening', { method:'POST', body: JSON.stringify(payload) });
          if (!res) return;
          // display results
          resultArea.innerHTML = '<h3>Screening result</h3>';
          if (res.results && res.results.length){
            resultArea.innerHTML += `<div class="result-highlight"><strong>Possible indicators:</strong><ul>${res.results.map(r=>`<li>${r}</li>`).join('')}</ul></div>`;
          } else {
            resultArea.innerHTML += `<div class="result-highlight"><strong>No significant signs detected</strong><p class="muted-note">If you still have concerns, consult a professional.</p></div>`;
          }
          // show therapist recommendations (if any)
          if (res.therapists && res.therapists.length){
            resultArea.innerHTML += '<h4>Recommended therapist centers</h4><ul>' + res.therapists.map(t=>`<li><strong>${t.name}</strong><br>${t.address} — ${t.phone}<br><a href="${t.website}" target="_blank">${t.website}</a></li>`).join('') + '</ul>';
          } else {
            resultArea.innerHTML += '<p class="muted-note">No nearby centers found for this condition and location.</p>';
          }
        });
        questionArea.appendChild(submitBtn);
      });
    });
  }

  // Therapist search page
  const therapistForm = q('#therapistForm');
  if (therapistForm){
    therapistForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const cond = q('#conditionSelect').value;
      const st = q('#therapistState').value;
      const res = await api(`/therapists?disorder=${cond}&state=${encodeURIComponent(st)}`);
      const out = q('#therapistResults');
      if (!res || !res.ok) { out.innerHTML = '<p class="muted-note">Error searching. Please log in or try again.</p>'; return; }
      if (res.therapists && res.therapists.length){
        out.innerHTML = '<ul>' + res.therapists.map(t=>`<li><strong>${t.name}</strong><br>${t.address} — ${t.phone}<br><a href="${t.website}" target="_blank">${t.website}</a></li>`).join('') + '</ul>';
      } else {
        out.innerHTML = '<p class="muted-note">No centers found for the selected condition and location.</p>';
      }
    });
  }

  // Basic load: if on index, nothing else. On add_child, screening, try to refresh children.
  if (q('#childrenList') || q('#childSelect')) refreshChildren();

  // Update navigation based on login status
  (async function updateNavigation() {
    try {
      const response = await api('/me');
      const accountLink = q('#account-link') || q('a[href="/login.html"]');
      
      if (response.ok && response.user) {
        // User is logged in - show user name and logout option
        if (accountLink) {
          accountLink.textContent = response.user.name || 'Account';
          accountLink.href = '#';
          accountLink.style.cursor = 'pointer';
          
          // Add logout functionality
          accountLink.addEventListener('click', async (e) => {
            e.preventDefault();
            const confirmed = confirm('Are you sure you want to log out?');
            if (confirmed) {
              await api('/logout');
              if (typeof toast !== 'undefined') {
                toast.show('Logged out successfully', 'info');
              }
              setTimeout(() => window.location.href = '/login.html', 500);
            }
          });
        }
      } else {
        // User is not logged in - show "Login" link
        if (accountLink) {
          accountLink.textContent = 'Login';
          accountLink.href = '/login.html';
        }
      }
    } catch (error) {
      console.log('Navigation update failed:', error);
    }
  })();

})();