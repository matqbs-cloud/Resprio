export const NativeFeatures = {
  wakeLock: null,
  keepScreenOn: false,
  isFullscreen: false,

  async enableWakeLock(enable) {
    this.keepScreenOn = enable;
    if (!('wakeLock' in navigator)) return;

    try {
      if (enable && !this.wakeLock) {
        this.wakeLock = await navigator.wakeLock.request('screen');
        this.wakeLock.addEventListener('release', () => {
          this.keepScreenOn = false;
        });
      }

      if (!enable && this.wakeLock) {
        await this.wakeLock.release();
        this.wakeLock = null;
      }
    } catch (e) {
      console.warn('WakeLock error', e);
    }
  },

  async toggleFullscreen(el) {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      this.isFullscreen = false;
      return false;
    }

    await el.requestFullscreen();
    this.isFullscreen = true;
    return true;
  },
};
