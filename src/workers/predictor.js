import Model from '../model/Model';

export async function predict() {
    const model = new Model();
    await model.load();
    return model.predict();
}
