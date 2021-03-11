
function getExtensionVersion() {
  manifest = chrome.runtime.getManifest();
  return manifest.version;
}
