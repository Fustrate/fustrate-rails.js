import { GlobalRegistrator } from '@happy-dom/global-registrator';

GlobalRegistrator.register();

// happy-dom does not implement window.alert/confirm/prompt
window.alert = () => {};
window.confirm = () => true;
window.prompt = () => null;
