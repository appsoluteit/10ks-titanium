//
//  HealthKitProvider.swift
//  TiHealthkit
//
//  Created by Appcelerator Developer on 14/5/20.
//  Sample code used from https://www.raywenderlich.com/459-healthkit-tutorial-with-swift-getting-started.

import Foundation
import HealthKit

class HealthKitProvider {
    enum HealthkitSetupError : Error {
        case notAvailableOnDevice
        case dataTypeNotAvailable
    }
    
    func authorizeHealthKit(completion: @escaping (Bool, Error?) -> Swift.Void) {
        //1. Check to see if HealthKit Is Available on this device
        guard HKHealthStore.isHealthDataAvailable() else {
          completion(false, HealthkitSetupError.notAvailableOnDevice)
          return
        }
        
        //2. Prepare the data types that will interact with HealthKit
        guard let stepCount = HKObjectType.quantityType(forIdentifier: .stepCount) else {
            completion(false, HealthkitSetupError.dataTypeNotAvailable)
            return
        }
        
        //3. Prepare a list of types you want HealthKit to read and write
        let healthKitTypesToWrite: Set<HKSampleType> = []
        let healthKitTypesToRead: Set<HKObjectType> = [ stepCount ]
        
        
        //4. Request Authorization
        HKHealthStore().requestAuthorization(toShare: healthKitTypesToWrite,
                                             read: healthKitTypesToRead) { (success, error) in
          completion(success, error)
        }
    }
}
