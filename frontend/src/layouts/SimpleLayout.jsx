import Navbar from "../components/Navbar";

export default function SimpleLayout({ title, children }) {
  return (
    <div style={styles.layout}>
      <Navbar title={title} />
      <div style={styles.content}>
        {children}
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
  content: {
    flex: 1,
    padding: '20px',
    minHeight: 'calc(100vh - 80px)'
  }
};