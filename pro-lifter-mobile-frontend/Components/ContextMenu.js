import React, { useState, useRef } from "react";
import { Modal, View, StyleSheet, Text, TouchableOpacity } from "react-native";

const ContextMenu = ({ onEdit, onDelete, isSaved }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const menuButtonRef = useRef(null);

  const handleMenuOpen = () => {
    menuButtonRef.current.measureInWindow((x, y, width, height) => {
      setMenuPosition({
        x: x + width - 100,
        y: y + height,
      });
      setMenuVisible(true);
    });
  };

  return (
    <>
      <TouchableOpacity ref={menuButtonRef} onPress={handleMenuOpen}>
        <Text style={styles.contextMenu}>•••</Text>
      </TouchableOpacity>

      {menuVisible && (
        <Modal
          animationType="fade"
          transparent={true}
          onRequestClose={() => setMenuVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            onPress={() => setMenuVisible(false)} // Close menu when backdrop is clicked
            activeOpacity={1} // Keep it fully opaque
          >
            <View
              style={{
                position: "absolute",
                left: menuPosition.x,
                top: menuPosition.y,
                width: 130,
              }}
            >
              <View style={styles.modalView}>
                {isSaved && (
                  <TouchableOpacity
                    onPress={() => {
                      onEdit();
                      setMenuVisible(false);
                    }}
                  >
                    <Text style={styles.modalText}>Edit</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => {
                    onDelete();
                    setMenuVisible(false);
                  }}
                >
                  <Text style={styles.modalText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMenuVisible(false)}>
                  <Text style={styles.modalText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  contextMenu: {
    fontSize: 24,
  },
  modalBackdrop: {
    flex: 1,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default ContextMenu;
