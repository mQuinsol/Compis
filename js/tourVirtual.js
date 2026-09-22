const VIDEO_ID = 'SGenxyjay4k';

export function initTourVirtual() {
  const btn = document.querySelector('#tourVirtualBtn');
  const modal = document.querySelector('#tourModal');
  const videoContainer = document.querySelector('#tourModalVideo');

  if (!btn || !modal || !videoContainer) return;

  // Sacamos el modal de .app-device para que el fixed sea real
  document.body.appendChild(modal);

  const backdrop = modal.querySelector('#tourModalBackdrop');
  const closeBtn = modal.querySelector('#tourModalClose');

  function openModal() {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0`;
    iframe.title = 'Tour virtual Compis';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    videoContainer.appendChild(iframe);
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('is-open');
    videoContainer.innerHTML = '';
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}