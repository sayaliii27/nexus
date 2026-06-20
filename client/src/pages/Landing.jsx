import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Landing() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #412653 0%, #3F567F 50%, #412653 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1
          style={{
            fontSize: "4rem",
            fontWeight: "800",
            background: "linear-gradient(135deg, #D174D2, #E0563F)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "1rem",
          }}
        >
          Nexus
        </h1>

        <p
          style={{
            fontSize: "1.2rem",
            color: "var(--text-muted)",
            marginBottom: "0.5rem",
          }}
        >
          Everything happening at your college
        </p>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--text-muted)",
            marginBottom: "3rem",
          }}
        >
          One place. All committees. No FOMO.
        </p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/signup")}
            style={{
              padding: "0.9rem 2.5rem",
              borderRadius: "50px",
              border: "none",
              background: "linear-gradient(135deg, #D174D2, #E0563F)",
              color: "#fff",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Get started
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
            style={{
              padding: "0.9rem 2.5rem",
              borderRadius: "50px",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "transparent",
              color: "#fff",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Log in
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        style={{
          marginTop: "4rem",
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {["E-Cell", "Coding Club", "Cultural Committee", "Sports Club"].map(
          (name) => (
            <div
              key={name}
              style={{
                padding: "0.6rem 1.2rem",
                borderRadius: "50px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "var(--text-muted)",
                fontSize: "0.85rem",
              }}
            >
              {name}
            </div>
          ),
        )}
      </motion.div>
    </div>
  );
}

export default Landing;
