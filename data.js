const STORAGE_KEY = "mybudget_data_v1";

const defaultData = {
  revenus: [],
  depenses: []
};

function getData() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultData;
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function addRevenu(obj) {
  const data = getData();
  data.revenus.push(obj);
  saveData(data);
}

function addDepense(obj) {
  const data = getData();
  data.depenses.push(obj);
  saveData(data);
}
