// file for using css modules in typescript-react
// allowing syntax:
// import styles from './style.module.css'
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}
