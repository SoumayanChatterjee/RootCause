import Navbar from "../components/Navbar";
import FarmerSidebar from "../components/FarmerSidebar";

export default function FarmerLayout({ title, children }) {
  return (
    <div style={styles.layout}>
      <Navbar title={title} />
      <div style={styles.container}>
        <FarmerSidebar />
        <div style={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

const styles = {
  layout: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(135deg, #f0f9e8 0%, #fffde7 100%)'
  },
  container: {
    display: 'flex',
    flex: 1,
    position: 'relative'
  },
  content: {
    flex: 1,
    marginLeft: '240px',
    padding: '20px',
    minHeight: 'calc(100vh - 80px)'
  }
};
