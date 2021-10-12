import Table from "./Table";

function Home() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Table />
      <span style={{ fontSize: 14, margin: 10 }}>
        Indice: changez les arguments en query
      </span>
    </div>
  );
}

export default Home;
