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
  
  // Calculate age from date of birth
  function calculateAge(dateOfBirth) {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    // Adjust age if birthday hasn't occurred this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    return age;
  }

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
          children.map(c => {
            const age = calculateAge(c.date_of_birth);
            return `
            <div class="card" style="padding: var(--space-4);">
              <div style="display: flex; align-items: start; gap: var(--space-3);">
                <div style="width: 48px; height: 48px; background: var(--color-primary-light); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: var(--color-primary); flex-shrink: 0;">
                  <span class="child-icon-${c.id}"></span>
                </div>
                <div style="flex: 1; min-width: 0;">
                  <h3 style="margin: 0 0 var(--space-2) 0; font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold);">${c.name}</h3>
                  <p style="margin: 0; color: var(--color-text-muted); font-size: var(--font-size-sm);">
                    <strong>Age:</strong> ${age} years old (Born: ${new Date(c.date_of_birth).toLocaleDateString()})
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
          `}).join('') + '</div>';
        
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
        children.map(c => {
          const age = calculateAge(c.date_of_birth);
          return `<option value="${c.id}">${c.name} (${age} years old)</option>`;
        }).join('');
    }
  }
  if (childForm){
    childForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const msgEl = q('#childMsg');
      const fd = new FormData(childForm);
      const body = { name: fd.get('name'), date_of_birth: fd.get('date_of_birth'), notes: fd.get('notes') };

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

  // Screening - Combined All Disorders
  const questionArea = q('#questionArea');
  const resultArea = q('#resultArea');
  const progressArea = q('#progressArea');
  const progressBar = q('#progressBar');
  const progressText = q('#progressText');
  const startScreeningBtn = q('#startScreening');
  
  if (startScreeningBtn){
    startScreeningBtn.addEventListener('click', async ()=>{
      const childId = q('#childSelect') ? q('#childSelect').value : null;
      if (!childId){ 
        alert('Please select a child first.'); 
        return; 
      }
      
      // Load all questions
      const qs = await api(`/questions`);
      if (!qs.ok){ 
        questionArea.innerHTML = '<div class="alert alert-danger"><span></span><div>Problem loading questions. Please try again.</div></div>'; 
        return; 
      }
      
      const allQuestions = qs.questions || [];
      if (allQuestions.length === 0) {
        questionArea.innerHTML = '<div class="alert alert-warning"><span></span><div>No questions found in database.</div></div>';
        return;
      }
      
      // Hide start button, show progress
      startScreeningBtn.style.display = 'none';
      progressArea.style.display = 'block';
      
      // Group questions by disorder
      const questionsByDisorder = {
        ASD: allQuestions.filter(q => q.disorder === 'ASD'),
        ADHD: allQuestions.filter(q => q.disorder === 'ADHD'),
        Dyslexia: allQuestions.filter(q => q.disorder === 'Dyslexia')
      };
      
      // Build combined questionnaire UI
      questionArea.innerHTML = `
        <div class="card" style="margin-bottom: var(--space-4);">
          <div class="card-header">
            <h3 class="card-title" style="margin: 0;">Complete Developmental Screening</h3>
            <p class="card-description">Please answer all ${allQuestions.length} questions honestly. There are no right or wrong answers.</p>
          </div>
        </div>
      `;
      
      // Add sections for each disorder
      ['ASD', 'ADHD', 'Dyslexia'].forEach((disorder, sectionIndex) => {
        const questions = questionsByDisorder[disorder];
        if (questions.length === 0) return;
        
        const sectionCard = document.createElement('div');
        sectionCard.className = 'card';
        sectionCard.style.marginBottom = 'var(--space-4)';
        
        const disorderInfo = {
          ASD: { name: 'Autism Spectrum Disorder (ASD)', color: 'var(--color-primary)' },
          ADHD: { name: 'Attention-Deficit/Hyperactivity Disorder (ADHD)', color: 'var(--color-secondary)' },
          Dyslexia: { name: 'Dyslexia', color: 'var(--color-accent)' }
        };
        
        sectionCard.innerHTML = `
          <div class="card-header" style="background: ${disorderInfo[disorder].color}15; border-bottom: 2px solid ${disorderInfo[disorder].color};">
            <h4 style="margin: 0; color: ${disorderInfo[disorder].color}; font-size: var(--font-size-lg);">
              Section ${sectionIndex + 1}: ${disorderInfo[disorder].name}
            </h4>
            <p style="margin: var(--space-2) 0 0 0; color: var(--color-text-muted); font-size: var(--font-size-sm);">
              ${questions.length} questions
            </p>
          </div>
          <div class="card-body" id="section-${disorder}"></div>
        `;
        
        questionArea.appendChild(sectionCard);
        
        const sectionBody = q(`#section-${disorder}`);
        questions.forEach((qObj, index) => {
          const questionDiv = document.createElement('div');
          questionDiv.className = 'form-group';
          questionDiv.dataset.id = qObj.id;
          questionDiv.dataset.disorder = disorder;
          questionDiv.style.paddingBottom = 'var(--space-4)';
          questionDiv.style.borderBottom = index < questions.length - 1 ? '1px solid var(--color-border)' : 'none';
          questionDiv.style.marginBottom = 'var(--space-4)';
          
          questionDiv.innerHTML = `
            <label class="form-label" style="font-weight: var(--font-weight-semibold); margin-bottom: var(--space-3);">
              ${index + 1}. ${qObj.question_text}
            </label>
            <div class="choices" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: var(--space-2);"></div>
          `;
          
          const choicesDiv = questionDiv.querySelector('.choices');
          const labels = ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'];
          
          labels.forEach((label, idx) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn btn-ghost';
            btn.style.fontSize = 'var(--font-size-sm)';
            btn.textContent = label;
            btn.dataset.score = idx;
            
            btn.addEventListener('click', () => {
              // Unselect siblings
              choicesDiv.querySelectorAll('.btn').forEach(b => {
                b.classList.remove('btn-primary');
                b.classList.add('btn-ghost');
              });
              btn.classList.remove('btn-ghost');
              btn.classList.add('btn-primary');
              questionDiv.dataset.score = idx;
              
              // Update progress
              updateProgress();
            });
            
            choicesDiv.appendChild(btn);
          });
          
          sectionBody.appendChild(questionDiv);
        });
      });
      
      // Add submit button
      const submitDiv = document.createElement('div');
      submitDiv.style.marginTop = 'var(--space-6)';
      submitDiv.innerHTML = `
        <button id="submitScreening" class="btn btn-primary btn-lg btn-full">
          Submit Screening
        </button>
      `;
      questionArea.appendChild(submitDiv);
      
      // Update progress function
      function updateProgress() {
        const total = allQuestions.length;
        const answered = questionArea.querySelectorAll('.form-group[data-score]').length;
        const percentage = Math.round((answered / total) * 100);
        progressBar.style.width = percentage + '%';
        progressText.textContent = percentage + '%';
      }
      
      // Submit button handler
      q('#submitScreening').addEventListener('click', async () => {
        const allDivs = questionArea.querySelectorAll('[data-id]');
        const answers = [];
        let unanswered = 0;
        
        allDivs.forEach(div => {
          if (div.dataset.score !== undefined) {
            answers.push({
              question_id: div.dataset.id,
              disorder: div.dataset.disorder,
              score: parseInt(div.dataset.score)
            });
          } else {
            unanswered++;
          }
        });
        
        if (unanswered > 0) {
          alert(`Please answer all questions. ${unanswered} question(s) remaining.`);
          return;
        }
        
        // Calculate scores per disorder
        const scores = {
          ASD: { total: 0, count: 0, max: 0 },
          ADHD: { total: 0, count: 0, max: 0 },
          Dyslexia: { total: 0, count: 0, max: 0 }
        };
        
        answers.forEach(ans => {
          scores[ans.disorder].total += ans.score;
          scores[ans.disorder].count++;
          scores[ans.disorder].max += 4; // Max score per question is 4
        });
        
        // Save to database
        const payload = {
          child_id: childId,
          answers: answers,
          state: q('#stateInput') ? q('#stateInput').value : ''
        };
        
        const saveRes = await api('/screening', { method: 'POST', body: JSON.stringify(payload) });
        
        // Display combined results
        displayCombinedResults(scores, saveRes.ok);
      });
    });
  }
  
  // Display combined results function
  function displayCombinedResults(scores, saved) {
    questionArea.innerHTML = '';
    progressArea.style.display = 'none';
    
    const interpretScore = (score, maxScore) => {
      const percentage = (score / maxScore) * 100;
      if (percentage < 25) return { level: 'Low', color: 'var(--color-success)', message: 'Low indicators' };
      if (percentage < 50) return { level: 'Mild', color: 'var(--color-warning)', message: 'Mild indicators - monitoring recommended' };
      if (percentage < 75) return { level: 'Moderate', color: 'var(--color-warning)', message: 'Moderate indicators - professional evaluation recommended' };
      return { level: 'High', color: 'var(--color-danger)', message: 'High indicators - professional evaluation strongly recommended' };
    };
    
    resultArea.innerHTML = `
      <div class="card" style="margin-top: var(--space-6);">
        <div class="card-header">
          <h3 class="card-title">Screening Results</h3>
          <p class="card-description">Complete developmental screening assessment</p>
        </div>
        <div class="card-body">
          ${saved ? '<div class="alert alert-success" style="margin-bottom: var(--space-4);"><span></span><div>Results saved successfully!</div></div>' : ''}
          
          ${['ASD', 'ADHD', 'Dyslexia'].map(disorder => {
            const scoreData = scores[disorder];
            const interpretation = interpretScore(scoreData.total, scoreData.max);
            const percentage = Math.round((scoreData.total / scoreData.max) * 100);
            
            const fullNames = {
              ASD: 'Autism Spectrum Disorder',
              ADHD: 'Attention-Deficit/Hyperactivity Disorder',
              Dyslexia: 'Dyslexia'
            };
            
            return `
              <div class="card" style="margin-bottom: var(--space-4); border-left: 4px solid ${interpretation.color};">
                <div class="card-body">
                  <h4 style="margin: 0 0 var(--space-3) 0; font-size: var(--font-size-lg);">${fullNames[disorder]}</h4>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); margin-bottom: var(--space-3);">
                    <div>
                      <p style="margin: 0; color: var(--color-text-muted); font-size: var(--font-size-sm);">Score</p>
                      <p style="margin: 0; font-size: var(--font-size-xl); font-weight: var(--font-weight-bold);">${scoreData.total} / ${scoreData.max}</p>
                    </div>
                    <div>
                      <p style="margin: 0; color: var(--color-text-muted); font-size: var(--font-size-sm);">Percentage</p>
                      <p style="margin: 0; font-size: var(--font-size-xl); font-weight: var(--font-weight-bold);">${percentage}%</p>
                    </div>
                  </div>
                  <div class="progress" style="margin-bottom: var(--space-3);">
                    <div class="progress-bar" style="width: ${percentage}%; background: ${interpretation.color};"></div>
                  </div>
                  <div class="alert" style="background: ${interpretation.color}15; border-color: ${interpretation.color}; margin: 0;">
                    <span style="color: ${interpretation.color};">●</span>
                    <div>
                      <strong style="color: ${interpretation.color};">${interpretation.level} Risk Level</strong>
                      <p style="margin: var(--space-1) 0 0 0;">${interpretation.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
          
          <div class="alert alert-info">
            <span></span>
            <div>
              <strong>Important Disclaimer</strong>
              <p style="margin: var(--space-2) 0 0 0;">This screening tool provides preliminary information only and does not replace professional medical evaluation or diagnosis. Please consult with qualified healthcare professionals for proper assessment and guidance.</p>
            </div>
          </div>
          
          <div style="display: flex; gap: var(--space-3); margin-top: var(--space-4); flex-wrap: wrap;">
            <a href="/therapists.html" class="btn btn-primary">
              Find Therapists
            </a>
            <button class="btn btn-ghost" onclick="window.location.reload()">
              Take Another Screening
            </button>
            <a href="/add_child.html" class="btn btn-ghost">
              Manage Children
            </a>
          </div>
        </div>
      </div>
    `;
    
    // Scroll to results
    resultArea.scrollIntoView({ behavior: 'smooth' });
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
      const accountLinks = qa('#account-link, a[href="/login.html"]');
      
      if (response.ok && response.user) {
        // User is logged in - update all account links
        accountLinks.forEach(link => {
          link.textContent = response.user.name || 'Account';
          link.href = '/account.html';
          link.style.cursor = 'pointer';
          
          // Remove any existing click listeners
          link.replaceWith(link.cloneNode(true));
        });
      } else {
        // User is not logged in - show "Login" link
        accountLinks.forEach(link => {
          link.textContent = 'Login';
          link.href = '/login.html';
        });
      }
    } catch (error) {
      console.log('Navigation update failed:', error);
    }
  })();

  // Account page functionality
  if (window.location.pathname === '/account.html') {
    (async function initAccountPage() {
      const loadingAccount = q('#loadingAccount');
      const notLoggedIn = q('#notLoggedIn');
      const accountContent = q('#accountContent');
      
      try {
        const response = await api('/me');
        
        if (response.ok && response.user) {
          // User is logged in - show account content
          loadingAccount.style.display = 'none';
          accountContent.style.display = 'block';
          
          // Populate user data
          q('#userName').textContent = response.user.name;
          q('#userEmail').textContent = response.user.email;
          q('#profileName').value = response.user.name;
          q('#profileEmail').value = response.user.email;
          
          // Get children count
          const childrenRes = await api('/children');
          if (childrenRes.ok) {
            q('#childrenCount').textContent = (childrenRes.children || []).length;
          }
          
          // Get screenings count (we'll implement this later)
          q('#screeningsCount').textContent = '0'; // Placeholder
          
        } else {
          // User is not logged in
          loadingAccount.style.display = 'none';
          notLoggedIn.style.display = 'block';
        }
      } catch (error) {
        console.error('Account page load failed:', error);
        loadingAccount.style.display = 'none';
        notLoggedIn.style.display = 'block';
      }
    })();

    // Profile form handling
    const profileForm = q('#profileForm');
    if (profileForm) {
      profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = profileForm.querySelector('button[type="submit"]');
        const msgEl = q('#profileMsg');
        const fd = new FormData(profileForm);
        
        submitBtn.disabled = true;
        msgEl.style.display = 'none';
        
        try {
          const response = await api('/profile', {
            method: 'PUT',
            body: JSON.stringify({
              name: fd.get('name'),
              email: fd.get('email')
            })
          });
          
          submitBtn.disabled = false;
          
          if (response.ok) {
            msgEl.className = 'alert alert-success';
            msgEl.style.display = 'block';
            msgEl.innerHTML = '<span class="msg-icon"></span><div>' + (response.message || 'Profile updated successfully!') + '</div>';
            if (typeof getIcon === 'function') {
              const icon = msgEl.querySelector('.msg-icon');
              if (icon) icon.innerHTML = getIcon('check');
            }
            if (typeof toast !== 'undefined') toast.show(response.message || 'Profile updated!', 'success');
            
            // Update display
            q('#userName').textContent = fd.get('name');
            q('#userEmail').textContent = fd.get('email');
            
            // Update navigation
            qa('#account-link').forEach(link => {
              link.textContent = fd.get('name');
            });
            
          } else {
            msgEl.className = 'alert alert-danger';
            msgEl.style.display = 'block';
            msgEl.innerHTML = '<span class="msg-icon"></span><div>' + (response.message || 'Failed to update profile') + '</div>';
            if (typeof getIcon === 'function') {
              const icon = msgEl.querySelector('.msg-icon');
              if (icon) icon.innerHTML = getIcon('alertCircle');
            }
            if (typeof toast !== 'undefined') toast.show(response.message || 'Update failed', 'danger');
          }
        } catch (error) {
          submitBtn.disabled = false;
          msgEl.className = 'alert alert-danger';
          msgEl.style.display = 'block';
          msgEl.innerHTML = '<span class="msg-icon"></span><div>Network error. Please try again.</div>';
          if (typeof getIcon === 'function') {
            const icon = msgEl.querySelector('.msg-icon');
            if (icon) icon.innerHTML = getIcon('alertCircle');
          }
          if (typeof toast !== 'undefined') toast.show('Network error', 'danger');
        }
      });
    }

    // Password form handling
    const passwordForm = q('#passwordForm');
    if (passwordForm) {
      passwordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = passwordForm.querySelector('button[type="submit"]');
        const msgEl = q('#passwordMsg');
        const fd = new FormData(passwordForm);
        
        // Validate passwords match
        if (fd.get('newPassword') !== fd.get('confirmPassword')) {
          msgEl.className = 'alert alert-danger';
          msgEl.style.display = 'block';
          msgEl.innerHTML = '<span class="msg-icon"></span><div>New passwords do not match</div>';
          if (typeof getIcon === 'function') {
            const icon = msgEl.querySelector('.msg-icon');
            if (icon) icon.innerHTML = getIcon('alertCircle');
          }
          return;
        }
        
        submitBtn.disabled = true;
        msgEl.style.display = 'none';
        
        try {
          const response = await api('/password', {
            method: 'PUT',
            body: JSON.stringify({
              currentPassword: fd.get('currentPassword'),
              newPassword: fd.get('newPassword')
            })
          });
          
          submitBtn.disabled = false;
          
          if (response.ok) {
            msgEl.className = 'alert alert-success';
            msgEl.style.display = 'block';
            msgEl.innerHTML = '<span class="msg-icon"></span><div>' + (response.message || 'Password updated successfully!') + '</div>';
            if (typeof getIcon === 'function') {
              const icon = msgEl.querySelector('.msg-icon');
              if (icon) icon.innerHTML = getIcon('check');
            }
            if (typeof toast !== 'undefined') toast.show(response.message || 'Password updated!', 'success');
            
            // Reset form
            passwordForm.reset();
            
          } else {
            msgEl.className = 'alert alert-danger';
            msgEl.style.display = 'block';
            msgEl.innerHTML = '<span class="msg-icon"></span><div>' + (response.message || 'Failed to update password') + '</div>';
            if (typeof getIcon === 'function') {
              const icon = msgEl.querySelector('.msg-icon');
              if (icon) icon.innerHTML = getIcon('alertCircle');
            }
            if (typeof toast !== 'undefined') toast.show(response.message || 'Update failed', 'danger');
          }
        } catch (error) {
          submitBtn.disabled = false;
          msgEl.className = 'alert alert-danger';
          msgEl.style.display = 'block';
          msgEl.innerHTML = '<span class="msg-icon"></span><div>Network error. Please try again.</div>';
          if (typeof getIcon === 'function') {
            const icon = msgEl.querySelector('.msg-icon');
            if (icon) icon.innerHTML = getIcon('alertCircle');
          }
          if (typeof toast !== 'undefined') toast.show('Network error', 'danger');
        }
      });
    }

    // Logout button
    const logoutBtn = q('#logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
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

    // Cancel edit button
    const cancelEdit = q('#cancelEdit');
    if (cancelEdit) {
      cancelEdit.addEventListener('click', () => {
        window.location.reload();
      });
    }
  }

})();