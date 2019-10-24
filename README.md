# Criando paginas

Para poder começar a criar paginas só é necessario saber de duas informações



This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

## Estratégia para desativar o autocomplete do gerenciador de senhas:
### Problematica
O gerenciador de senhas preenche automaticamente o campo senha (input password). Existe um atributo do input chamado autocomplete, porem o mesmo não está mais funcional nos browsers após a implementação dos gerenciadores de senha.

### Solução
O preenchimento automatico é feito logo após a renderização da tela. Desta forma, se o input for renderizado desabilitado e habilitado logo após, o browser não terá como preencher.<br>
Na tela de perfil foi aicionada uma flag para habilitar e desabilitar os campos de troca de senha. O valor padrão desta flag é: true.<br> No componentDidMount após um breve momento (timeout) esta flag é mudada para false.

## Problemas ao editar item de avaliação
Ao editar um item de avaliação que esteja vinculado a alguma tela do mapa de navegação, o transfer de vinculação de itens não poderá encontrar o item da tela pelo nome, pois o item é copiado na hora da vinculação e o mesmo estará desatualizado após a edição do original.

## A fazer: 
- 30/05/2019 
  - 1668; Faltando integração com a api para alteração de senha ao editar o perfil do usuário.# mucha
