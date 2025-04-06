import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { Text, Icon } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import ImageView from "react-native-image-viewing";
import { Attachment } from "../types";
import { customColors, typography } from "../theme";

interface AttachmentSectionProps {
  attachments: Attachment[];
  onAttachmentsChange: (attachments: Attachment[]) => void;
}

export default function AttachmentSection({
  attachments,
  onAttachmentsChange,
}: AttachmentSectionProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);
  const imageAttachments = attachments.filter((att) => att.type === "image");

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant permission to access your media library"
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    if (!(await requestPermissions())) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (!result.canceled) {
        const newAttachment: Attachment = {
          id: Date.now().toString(),
          uri: result.assets[0].uri,
          type: "image",
          name: result.assets[0].uri.split("/").pop() || "image.jpg",
          timestamp: new Date().toISOString(),
        };
        onAttachmentsChange([...attachments, newAttachment]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
      });

      if (!result.canceled) {
        const newAttachment: Attachment = {
          id: Date.now().toString(),
          uri: result.assets[0].uri,
          type: result.assets[0].mimeType || "application/pdf",
          name: result.assets[0].name,
          timestamp: new Date().toISOString(),
        };
        onAttachmentsChange([...attachments, newAttachment]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const removeAttachment = (id: string) => {
    onAttachmentsChange(attachments.filter((att) => att.id !== id));
  };

  const handleImagePress = (index: number) => {
    setSelectedImageIndex(index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Attachments</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={pickImage}>
          <Icon
            name="image"
            type="material"
            size={24}
            color={customColors.primary}
          />
          <Text style={styles.buttonText}>Add Image</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton} onPress={pickDocument}>
          <Icon
            name="description"
            type="material"
            size={24}
            color={customColors.primary}
          />
          <Text style={styles.buttonText}>Add Document</Text>
        </TouchableOpacity>
      </View>

      {attachments.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.attachmentList}
        >
          {attachments.map((attachment, index) => (
            <TouchableOpacity
              key={attachment.id}
              style={styles.attachmentItem}
              onPress={() => {
                if (attachment.type === "image") {
                  const imageIndex = imageAttachments.findIndex(
                    (img) => img.id === attachment.id
                  );
                  if (imageIndex !== -1) {
                    handleImagePress(imageIndex);
                  }
                }
              }}
            >
              {attachment.type === "image" ? (
                <Image
                  source={{ uri: attachment.uri }}
                  style={styles.imagePreview}
                />
              ) : (
                <Icon
                  name="description"
                  type="material"
                  size={24}
                  color={customColors.text}
                />
              )}
              <Text style={styles.attachmentName} numberOfLines={1}>
                {attachment.name}
              </Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeAttachment(attachment.id)}
              >
                <Icon
                  name="close"
                  type="material"
                  size={20}
                  color={customColors.error}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <ImageView
        images={imageAttachments.map((img) => ({ uri: img.uri }))}
        imageIndex={selectedImageIndex}
        visible={selectedImageIndex >= 0}
        onRequestClose={() => setSelectedImageIndex(-1)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    ...typography.h3,
    color: customColors.primary,
    marginBottom: 8,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginBottom: 12,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(209, 79, 48, 0.1)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 0.48,
    justifyContent: "center",
  },
  buttonText: {
    ...typography.button,
    color: customColors.primary,
    marginLeft: 8,
    fontSize: 15,
  },
  attachmentList: {
    marginHorizontal: 10,
  },
  imagePreview: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 8,
  },
  attachmentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: customColors.inputBackground,
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
    minWidth: 150,
    maxWidth: 200,
  },
  attachmentName: {
    ...typography.body2,
    color: customColors.text,
    marginHorizontal: 8,
    flex: 1,
  },
  removeButton: {
    padding: 4,
  },
});
